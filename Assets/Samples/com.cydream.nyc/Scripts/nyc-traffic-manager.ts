type Vector3 = CS.UnityEngine.Vector3;

type RoadNode = {
    id: number;
    position: Vector3;
    forward: Vector3;
    next: RoadNode[];
    speed: number;
};

type TrafficCar = {
    root: CS.UnityEngine.GameObject;
    vehicle: any;
    transform: CS.UnityEngine.Transform;
    center: CS.UnityEngine.Transform;
    target: RoadNode;
    afterTarget: RoadNode | null;
    laneOffset: number;
    targetSpeed: number;
    lastPosition: Vector3;
    estimatedSpeed: number;
    stuckSeconds: number;
    lifeSeconds: number;
};

type PendingCar = {
    root: CS.UnityEngine.GameObject;
    spawnPosition: Vector3;
    target: RoadNode;
    afterTarget: RoadNode | null;
    laneOffset: number;
    targetSpeed: number;
    resolveAt: number;
    giveUpAt: number;
    key: string;
};

export class NYCTrafficManager {
    private readonly bindTo: VX.Mod.JsComponentProxy;
    private readonly cars: TrafficCar[] = [];
    private readonly pendingCars: PendingCar[] = [];
    private readonly nodes: RoadNode[] = [];
    private usingCustomRoadGraph = false;

    private readonly carItemKeys = [
        "Vehicles/Convertible Car",
        "Vehicles/Couple Car",
        "Vehicles/Wagon Car",
    ];

    private readonly desiredCarCount = 4;
    private readonly spawnHeight = 1.2;
    private readonly laneWidth = 4.2;
    private readonly reachDistance = 7.0;
    private readonly minSpawnCameraDistance = 45.0;
    private readonly recycleCameraDistance = 390.0;
    private readonly safeFollowingDistance = 18.0;
    private readonly defaultTargetSpeed = 7.5;
    private readonly maxSteerAngle = 60.0;
    private readonly spawnRetryCooldown = 2.0;
    private nextSpawnTime = 0;

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        this.bindTo = bindTo;
        this.bindTo.onStart = () => this.onStart();
        this.bindTo.onUpdate = (dt) => this.onUpdate(dt);
        this.bindTo.onDestroy = () => this.onDestroy();
    }

    private onStart(): void {
        this.nodes.length = 0;
        this.nodes.push(...this.loadRoadGraph());

        if (this.nodes.length < 2) {
            CS.UnityEngine.Debug.LogWarning("[NYC Traffic] No traffic road graph could be built.");
            return;
        }

        for (let i = 0; i < this.desiredCarCount; i++) {
            this.spawnCar(i);
        }

        CS.UnityEngine.Debug.Log(`[NYC Traffic] Started with ${this.nodes.length} road nodes and ${this.cars.length} cars.`);
    }

    private onUpdate(deltaTime: number): void {
        if (this.nodes.length < 2) {
            return;
        }

        this.resolvePendingCars();
        this.drawRoadDebug();

        for (let i = this.cars.length - 1; i >= 0; i--) {
            const car = this.cars[i];
            if (this.isCarInvalid(car)) {
                this.cars.splice(i, 1);
                continue;
            }

            if (this.shouldRecycle(car)) {
                this.recycleCar(car, i);
                continue;
            }

            this.updateCar(car, deltaTime);
        }

        const liveAndPendingCars = this.cars.length + this.pendingCars.length;
        const missingCars = this.desiredCarCount - liveAndPendingCars;
        if (missingCars > 0 && CS.UnityEngine.Time.time >= this.nextSpawnTime) {
            for (let i = 0; i < missingCars; i++) {
                this.spawnCar(liveAndPendingCars + i);
            }
        }
    }

    private onDestroy(): void {
        for (const car of this.cars) {
            if (car.root != null) {
                CS.UnityEngine.Object.Destroy(car.root);
            }
        }
        for (const pending of this.pendingCars) {
            if (pending.root != null) {
                CS.UnityEngine.Object.Destroy(pending.root);
            }
        }
        this.cars.length = 0;
        this.pendingCars.length = 0;
    }

    private updateCar(car: TrafficCar, deltaTime: number): void {
        car.lifeSeconds += deltaTime;

        const Vec3 = CS.UnityEngine.Vector3;
        const Mathf = CS.UnityEngine.Mathf;
        const position = this.getCarPosition(car);
        if (position == null) {
            return;
        }

        const moved = Vec3.op_Subtraction(position, car.lastPosition).magnitude;
        car.estimatedSpeed = Mathf.Lerp(car.estimatedSpeed, moved / Mathf.Max(deltaTime, 0.0001), 0.22);
        car.lastPosition = this.cloneVector(position);

        let targetPoint = this.getLaneTarget(car.target, car.laneOffset);
        const distanceToTarget = this.horizontalDistance(position, targetPoint);

        if (distanceToTarget < this.reachDistance) {
            this.advanceTarget(car);
            targetPoint = this.getLaneTarget(car.target, car.laneOffset);
        }

        const toTarget = this.flatten(Vec3.op_Subtraction(targetPoint, position));
        if (toTarget.sqrMagnitude < 0.01) {
            return;
        }

        const desiredDirection = toTarget.normalized;
        const signedAngle = Vec3.SignedAngle(this.flatten(car.transform.forward).normalized, desiredDirection, Vec3.up);
        const steer = Mathf.Clamp(signedAngle / this.maxSteerAngle, -1.0, 1.0);
        const frontCarFactor = 0;
        const targetSpeed = car.targetSpeed * (frontCarFactor > 0 ? 0.35 : 1.0);
        const speedError = targetSpeed - car.estimatedSpeed;

        let throttle = Mathf.Clamp01(0.24 + speedError * 0.08);

        if (frontCarFactor > 0) {
            throttle = 0;
        } else if (speedError < -2.0) {
            throttle = 0.05;
        }

        if (Mathf.Abs(signedAngle) > 45) {
            throttle *= 0.55;
        }

        if (Mathf.Abs(signedAngle) > 75) {
            throttle = Mathf.Max(throttle * 0.5, 0.16);
        }

        if (car.estimatedSpeed < 0.2 && throttle < 0.12) {
            throttle = 0.18;
        }

        if (car.estimatedSpeed < 0.65 && throttle > 0.3) {
            car.stuckSeconds += deltaTime;
        } else {
            car.stuckSeconds = 0;
        }

        if (car.stuckSeconds > 5.0 && car.lifeSeconds > 4.0) {
            this.teleportCarToNode(car, this.pickSpawnNode());
            return;
        }

        const steering = new CS.UnityEngine.Vector4(0, steer, 0, 0);
        CS.VoxelPlayground.Mod.ModAPI.ApplyVehicleSteering(car.vehicle, steering);

        if (throttle > 0.01) {
            CS.VoxelPlayground.Mod.ModAPI.ApplyVehicleThrottle(car.vehicle, throttle);
        }

        this.drawCarDebug(car, position, targetPoint, signedAngle, throttle);
    }

    private advanceTarget(car: TrafficCar): void {
        if (car.afterTarget == null) {
            car.afterTarget = this.chooseNext(car.target);
        }

        car.target = car.afterTarget;
        car.afterTarget = this.chooseNext(car.target);

        if (CS.UnityEngine.Random.value < 0.18) {
            car.targetSpeed = CS.UnityEngine.Random.Range(5.5, 9.0);
        }
    }

    private spawnCar(seed: number): void {
        const spawnNode = this.pickSpawnNode();
        if (spawnNode == null) {
            return;
        }

        const target = this.chooseNext(spawnNode);
        const direction = this.directionBetween(spawnNode.position, target.position, spawnNode.forward);
        const spawnPos = CS.UnityEngine.Vector3.op_Addition(
            this.getLaneTarget(spawnNode, 0),
            CS.UnityEngine.Vector3.op_Multiply(CS.UnityEngine.Vector3.up, this.spawnHeight),
        );
        const spawnRot = CS.UnityEngine.Quaternion.LookRotation(direction, CS.UnityEngine.Vector3.up);
        const key = this.carItemKeys[seed % this.carItemKeys.length];
        const root = CS.VoxelPlayground.Mod.ModAPI.SpawnItem(key, spawnPos, spawnRot);

        if (root == null) {
            CS.UnityEngine.Debug.LogWarning(`[NYC Traffic] Failed to spawn ${key}.`);
            this.nextSpawnTime = CS.UnityEngine.Time.time + this.spawnRetryCooldown;
            return;
        }

        const laneOffset = 0;

        this.pendingCars.push({
            root,
            spawnPosition: spawnPos,
            target,
            afterTarget: this.chooseNext(target),
            laneOffset,
            targetSpeed: this.defaultTargetSpeed + CS.UnityEngine.Random.Range(-1.0, 1.0),
            resolveAt: CS.UnityEngine.Time.time + 0.05,
            giveUpAt: CS.UnityEngine.Time.time + 2.0,
            key,
        });
    }

    private resolvePendingCars(): void {
        const now = CS.UnityEngine.Time.time;
        for (let i = this.pendingCars.length - 1; i >= 0; i--) {
            const pending = this.pendingCars[i];

            if (now < pending.resolveAt) {
                continue;
            }

            const vehicle = this.findVehicleNear(pending.spawnPosition);
            if (vehicle != null) {
                const vehicleTransform = CS.VoxelPlayground.Mod.ModAPI.GetVehicleTransform(vehicle);
                const center = CS.VoxelPlayground.Mod.ModAPI.GetVehicleCenterOfMass(vehicle) ?? vehicleTransform;

                CS.VoxelPlayground.Mod.ModAPI.SetVehicleEngineEnabled(vehicle, true);

                this.cars.push({
                    root: vehicleTransform.gameObject,
                    vehicle,
                    transform: vehicleTransform,
                    center,
                    target: pending.target,
                    afterTarget: pending.afterTarget,
                    laneOffset: pending.laneOffset,
                    targetSpeed: pending.targetSpeed,
                    lastPosition: this.cloneVector(center.position),
                    estimatedSpeed: 0,
                    stuckSeconds: 0,
                    lifeSeconds: 0,
                });

                this.pendingCars.splice(i, 1);
                continue;
            }

            if (now >= pending.giveUpAt) {
                CS.UnityEngine.Debug.LogWarning(`[NYC Traffic] Spawned ${pending.key}, but no IVehicle component was found near spawn point.`);
                if (pending.root != null) {
                    CS.UnityEngine.Object.Destroy(pending.root);
                }
                this.pendingCars.splice(i, 1);
                this.nextSpawnTime = now + this.spawnRetryCooldown;
            } else {
                pending.resolveAt = now + 0.15;
            }
        }
    }

    private recycleCar(car: TrafficCar, index: number): void {
        if (car.root != null) {
            CS.UnityEngine.Object.Destroy(car.root);
        }
        this.cars.splice(index, 1);
    }

    private teleportCarToNode(car: TrafficCar, node: RoadNode | null): void {
        if (node == null) {
            return;
        }

        const target = this.chooseNext(node);
        const direction = this.directionBetween(node.position, target.position, node.forward);
        const position = CS.UnityEngine.Vector3.op_Addition(
            this.getLaneTarget(node, car.laneOffset),
            CS.UnityEngine.Vector3.op_Multiply(CS.UnityEngine.Vector3.up, this.spawnHeight),
        );

        car.transform.position = position;
        car.transform.rotation = CS.UnityEngine.Quaternion.LookRotation(direction, CS.UnityEngine.Vector3.up);
        car.target = target;
        car.afterTarget = this.chooseNext(target);
        car.lastPosition = this.cloneVector(position);
        car.estimatedSpeed = 0;
        car.stuckSeconds = 0;
        car.lifeSeconds = 0;
    }

    private shouldRecycle(car: TrafficCar): boolean {
        const camera = CS.VoxelPlayground.Mod.ModAPI.GetMainCamera();
        if (this.isUnityNull(camera) || this.isUnityNull(car.transform)) {
            return false;
        }

        return this.horizontalDistance(camera.transform.position, car.transform.position) > this.recycleCameraDistance;
    }

    private pickSpawnNode(): RoadNode | null {
        if (this.nodes.length === 0) {
            return null;
        }

        const camera = CS.VoxelPlayground.Mod.ModAPI.GetMainCamera();
        for (let i = 0; i < 32; i++) {
            const node = this.nodes[this.randomIndex(this.nodes.length)];
            if (camera == null || this.horizontalDistance(camera.transform.position, node.position) > this.minSpawnCameraDistance) {
                return node;
            }
        }

        return this.nodes[this.randomIndex(this.nodes.length)];
    }

    private getFrontCarBrakeFactor(car: TrafficCar): number {
        let closest = Number.POSITIVE_INFINITY;
        const position = this.getCarPosition(car);
        if (position == null || this.isUnityNull(car.transform)) {
            return 0;
        }
        const forward = this.flatten(car.transform.forward).normalized;

        for (const other of this.cars) {
            const otherPosition = this.getCarPosition(other);
            if (other === car || otherPosition == null) {
                continue;
            }

            const delta = this.flatten(CS.UnityEngine.Vector3.op_Subtraction(otherPosition, position));
            const forwardDistance = CS.UnityEngine.Vector3.Dot(delta, forward);
            if (forwardDistance <= 0 || forwardDistance > this.safeFollowingDistance) {
                continue;
            }

            const lateral = CS.UnityEngine.Vector3.op_Subtraction(
                delta,
                CS.UnityEngine.Vector3.op_Multiply(forward, forwardDistance),
            ).magnitude;

            if (lateral < this.laneWidth * 0.9 && forwardDistance < closest) {
                closest = forwardDistance;
            }
        }

        if (!Number.isFinite(closest)) {
            return 0;
        }

        return CS.UnityEngine.Mathf.Clamp01(1.0 - closest / this.safeFollowingDistance);
    }

    private findVehicleNear(position: Vector3): any | null {
        const components = CS.UnityEngine.Object.FindObjectsByType(
            puerts.$typeof(CS.UnityEngine.Component),
            CS.UnityEngine.FindObjectsSortMode.None,
        );

        let closestVehicle: any | null = null;
        let closestDistSq = 16.0 * 16.0;

        for (let i = 0; i < components.Length; i++) {
            const component = components.get_Item(i) as any;
            if (component == null) {
                continue;
            }

            try {
                const vehicleTransform = CS.VoxelPlayground.Mod.ModAPI.GetVehicleTransform(component);
                if (vehicleTransform != null) {
                    const distSq = this.flatten(CS.UnityEngine.Vector3.op_Subtraction(vehicleTransform.position, position)).sqrMagnitude;
                    if (distSq < closestDistSq && !this.isTrackedVehicle(component)) {
                        closestVehicle = component;
                        closestDistSq = distSq;
                    }
                }
            } catch (_err) {
                // Non-vehicle components are expected here.
            }
        }

        return closestVehicle;
    }

    private isTrackedVehicle(vehicle: any): boolean {
        for (const car of this.cars) {
            if (car.vehicle === vehicle) {
                return true;
            }
        }

        return false;
    }

    private loadRoadGraph(): RoadNode[] {
        const fromScene = this.loadRoadGraphFromScene();
        if (fromScene.length > 1) {
            this.usingCustomRoadGraph = true;
            return fromScene;
        }

        this.usingCustomRoadGraph = false;
        return this.createFallbackManhattanGraph();
    }

    private loadRoadGraphFromScene(): RoadNode[] {
        const roadParent = this.bindTo.transform.Find("TrafficRoads");
        if (roadParent == null) {
            return [];
        }

        const result: RoadNode[] = [];

        for (let routeIndex = 0; routeIndex < roadParent.childCount; routeIndex++) {
            const route = roadParent.GetChild(routeIndex);
            const routeNodes: RoadNode[] = [];

            for (let i = 0; i < route.childCount; i++) {
                const point = route.GetChild(i);
                routeNodes.push({
                    id: result.length,
                    position: this.cloneVector(point.position),
                    forward: this.flatten(point.forward).normalized,
                    next: [],
                    speed: this.defaultTargetSpeed,
                });
                result.push(routeNodes[routeNodes.length - 1]);
            }

            for (let i = 0; i < routeNodes.length; i++) {
                const next = routeNodes[(i + 1) % routeNodes.length];
                routeNodes[i].next.push(next);
                routeNodes[i].forward = this.directionBetween(routeNodes[i].position, next.position, routeNodes[i].forward);
            }
        }

        return result;
    }

    private createFallbackManhattanGraph(): RoadNode[] {
        const xRoads = [-430, -358, -259, -231, -141, -54, 29, 96, 176, 238, 337, 435, 507];
        const zRoads = [-532, -472, -380, -313, -259, -223, -187, -115, -49, -12, 54, 92, 137, 211, 258, 312, 360];
        const grid: RoadNode[][] = [];
        const result: RoadNode[] = [];

        for (let z = 0; z < zRoads.length; z++) {
            const row: RoadNode[] = [];
            for (let x = 0; x < xRoads.length; x++) {
                const forward = z % 2 === 0
                    ? new CS.UnityEngine.Vector3(1, 0, 0)
                    : new CS.UnityEngine.Vector3(-1, 0, 0);
                const node: RoadNode = {
                    id: result.length,
                    position: new CS.UnityEngine.Vector3(xRoads[x], 0.15, zRoads[z]),
                    forward,
                    next: [],
                    speed: this.defaultTargetSpeed,
                };
                row.push(node);
                result.push(node);
            }
            grid.push(row);
        }

        for (let z = 0; z < zRoads.length; z++) {
            for (let x = 0; x < xRoads.length; x++) {
                const node = grid[z][x];

                if (z % 2 === 0) {
                    node.next.push(grid[z][(x + 1) % xRoads.length]);
                } else {
                    node.next.push(grid[z][(x - 1 + xRoads.length) % xRoads.length]);
                }

                if (x % 2 === 0) {
                    node.next.push(grid[(z + 1) % zRoads.length][x]);
                } else {
                    node.next.push(grid[(z - 1 + zRoads.length) % zRoads.length][x]);
                }
            }
        }

        return result;
    }

    private chooseNext(node: RoadNode): RoadNode {
        if (node.next.length === 0) {
            return this.nodes[this.randomIndex(this.nodes.length)];
        }

        if (node.next.length === 1 || CS.UnityEngine.Random.value > 0.35) {
            return node.next[0];
        }

        return node.next[this.randomIndex(node.next.length)];
    }

    private getLaneTarget(node: RoadNode, laneOffset: number): Vector3 {
        const direction = node.forward.sqrMagnitude > 0.001 ? node.forward : CS.UnityEngine.Vector3.forward;
        const right = CS.UnityEngine.Vector3.Cross(CS.UnityEngine.Vector3.up, direction).normalized;
        return CS.UnityEngine.Vector3.op_Addition(node.position, CS.UnityEngine.Vector3.op_Multiply(right, laneOffset));
    }

    private randomLaneOffset(): number {
        return (CS.UnityEngine.Random.value > 0.5 ? 0.5 : -0.5) * this.laneWidth;
    }

    private randomIndex(length: number): number {
        return CS.UnityEngine.Mathf.FloorToInt(CS.UnityEngine.Random.value * length);
    }

    private directionBetween(from: Vector3, to: Vector3, fallback: Vector3): Vector3 {
        const direction = this.flatten(CS.UnityEngine.Vector3.op_Subtraction(to, from));
        if (direction.sqrMagnitude < 0.001) {
            return fallback.sqrMagnitude > 0.001 ? this.flatten(fallback).normalized : CS.UnityEngine.Vector3.forward;
        }

        return direction.normalized;
    }

    private horizontalDistance(a: Vector3, b: Vector3): number {
        return this.flatten(CS.UnityEngine.Vector3.op_Subtraction(a, b)).magnitude;
    }

    private flatten(v: Vector3): Vector3 {
        return new CS.UnityEngine.Vector3(v.x, 0, v.z);
    }

    private cloneVector(v: Vector3): Vector3 {
        return new CS.UnityEngine.Vector3(v.x, v.y, v.z);
    }

    private isCarInvalid(car: TrafficCar): boolean {
        if (this.isUnityNull(car.root) || this.isUnityNull(car.vehicle) || this.isUnityNull(car.transform)) {
            return true;
        }

        try {
            return CS.VoxelPlayground.Mod.ModAPI.IsVehicleExploded(car.vehicle);
        } catch (_err) {
            return true;
        }
    }

    private getCarPosition(car: TrafficCar): Vector3 | null {
        try {
            if (!this.isUnityNull(car.center)) {
                return car.center.position;
            }
            if (!this.isUnityNull(car.transform)) {
                return car.transform.position;
            }
        } catch (_err) {
            return null;
        }

        return null;
    }

    private isUnityNull(obj: any): boolean {
        return obj == null || CS.UnityEngine.Object.op_Equality(obj as CS.UnityEngine.Object, null as any);
    }

    private drawRoadDebug(): void {
        const Giz = VX.Utility.Giz;
        if (!Giz.show) {
            return;
        }

        const Color = CS.UnityEngine.Color;
        for (const node of this.nodes) {
            const pos = CS.UnityEngine.Vector3.op_Addition(node.position, CS.UnityEngine.Vector3.up);
            Giz.DrawWireSphere(pos, this.usingCustomRoadGraph ? 1.6 : 0.7, Color.cyan);
            if (this.usingCustomRoadGraph) {
                Giz.DrawLabel(pos, `P${node.id}`, Color.cyan, 12);
            }

            for (const next of node.next) {
                const nextPos = CS.UnityEngine.Vector3.op_Addition(next.position, CS.UnityEngine.Vector3.up);
                Giz.DrawLine(pos, nextPos, Color.gray);
                Giz.DrawRayArrow(pos, CS.UnityEngine.Vector3.op_Multiply(this.directionBetween(pos, nextPos, node.forward), 4.0), Color.green);
            }
        }
    }

    private drawCarDebug(car: TrafficCar, position: Vector3, targetPoint: Vector3, signedAngle: number, throttle: number): void {
        const Giz = VX.Utility.Giz;
        if (!Giz.show) {
            return;
        }

        const Color = CS.UnityEngine.Color;
        const carPos = CS.UnityEngine.Vector3.op_Addition(position, CS.UnityEngine.Vector3.up);
        const targetPos = CS.UnityEngine.Vector3.op_Addition(targetPoint, CS.UnityEngine.Vector3.up);
        Giz.DrawLine(carPos, targetPos, Color.yellow);
        Giz.DrawWireSphere(targetPos, 2.2, Color.yellow);
        Giz.DrawLabel(
            CS.UnityEngine.Vector3.op_Addition(carPos, CS.UnityEngine.Vector3.op_Multiply(CS.UnityEngine.Vector3.up, 2.5)),
            `target P${car.target.id} speed ${car.estimatedSpeed.toFixed(1)} angle ${signedAngle.toFixed(0)} thr ${throttle.toFixed(2)}`,
            Color.yellow,
            12,
        );
    }
}
