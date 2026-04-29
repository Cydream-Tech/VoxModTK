import { Maths } from "com.cydream.utilities";

type CubeCell = {
    cube: CS.UnityEngine.GameObject;
    baseLocalPosition: CS.UnityEngine.Vector3;
    phaseOffset: number;
};

export class CubeArray {
    private readonly bindTo: VX.Mod.JsComponentProxy;
    private readonly cubes: CubeCell[] = [];

    private elapsedTime = 0;
    private readonly gridWidth = 12;
    private readonly gridHeight = 12;
    private readonly spacing = 1.25;
    private readonly waveAmplitude = 1.5;
    private readonly waveSpeed = 2.25;
    private readonly phaseStep = 0.55;

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        this.bindTo = bindTo;
        this.bindTo.onStart = () => this.onStart();
        this.bindTo.onUpdate = (dt) => this.onUpdate(dt);
        this.bindTo.onDestroy = () => this.onDestroy();
    }

    private onStart(): void {
        if (this.cubes.length > 0) {
            return;
        }

        const halfWidth = (this.gridWidth - 1) * this.spacing * 0.5;
        const halfHeight = (this.gridHeight - 1) * this.spacing * 0.5;

        for (let x = 0; x < this.gridWidth; x++) {
            for (let z = 0; z < this.gridHeight; z++) {
                const cube = CS.UnityEngine.GameObject.CreatePrimitive(CS.UnityEngine.PrimitiveType.Cube);
                cube.name = `WaveCube_${x}_${z}`;
                cube.transform.SetParent(this.bindTo.transform, false);
                cube.transform.localScale = new CS.UnityEngine.Vector3(0.9, 0.9, 0.9);

                let localPosition = new CS.UnityEngine.Vector3(0, 0, 0);
                localPosition = Maths.SetX(localPosition, x * this.spacing - halfWidth);
                localPosition = Maths.SetY(localPosition, 0);
                localPosition = Maths.SetZ(localPosition, z * this.spacing - halfHeight);
                cube.transform.localPosition = localPosition;

                this.cubes.push({
                    cube,
                    baseLocalPosition: localPosition,
                    phaseOffset: (x + z) * this.phaseStep
                });
            }
        }
    }

    private onUpdate(deltaTime: number): void {
        this.elapsedTime += deltaTime;

        for (let i = 0; i < this.cubes.length; i++) {
            const cell = this.cubes[i];
            const waveHeight = CS.UnityEngine.Mathf.Sin(this.elapsedTime * this.waveSpeed + cell.phaseOffset)
                * this.waveAmplitude;

            cell.cube.transform.localPosition = Maths.SetY(cell.baseLocalPosition, waveHeight);
        }
    }

    private onDestroy(): void {
        for (let i = 0; i < this.cubes.length; i++) {
            const cube = this.cubes[i].cube;
            if (cube !== null) {
                CS.UnityEngine.GameObject.Destroy(cube);
            }
        }

        this.cubes.length = 0;
    }
}
