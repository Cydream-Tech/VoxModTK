/**
 * Gipsy Mech Muscle implementation using JsComponentProxy.
 * Converted from MechMuscle.cs — parent MechController via GetScriptInParent;
 * VoxelDestructor fragment loss destroys joint and disables floating.
 */

import { MechController } from './mech-controller';
const Giz = VX.Utility.Giz;

export class MechMuscle {
    private bindTo: VX.Mod.JsComponentProxy;
    private mechController: MechController | null = null;
    private joint: CS.Px5.Unity.PxD6Joint | null = null;
    private voxelDestructor: VX.Destruction.VoxelDestructor | null = null;
    private voxelVolume: VX.Engine.VoxelVolume | null = null;
    private fragmentedHandler: (() => void) | null = null;

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        this.bindTo = bindTo;
        this.initialize();
    }
    
    private onStart(){
        let propsComponent = this.bindTo.GetComponent(puerts.$typeof(VX.Mod.JsProperties)) as VX.Mod.JsProperties;
        if (propsComponent != null) {
            for (let i = 0; i < propsComponent.Pairs.Length; i++) {
                const p = propsComponent.Pairs.get_Item(i);
                if(p.key == "mechController"){
                    this.mechController = (p.value as VX.Mod.JsComponentProxy).GetScript(MechController.name);
                }
            }
        }
    }

    private initialize(): void {
        
        this.joint = this.bindTo.GetComponent(puerts.$typeof(CS.Px5.Unity.PxD6Joint)) as CS.Px5.Unity.PxD6Joint;

        // const mcGoName =
        //     this.mechController != null
        //         ? (this.mechController as { bindTo?: VX.Mod.JsComponentProxy }).bindTo
        //               ?.gameObject?.name
        //         : null;
        CS.UnityEngine.Debug.Log('MechMuscle Init ' + this.bindTo.name + ' ' + this.joint);

        const vc = this.bindTo.GetComponent(
            puerts.$typeof(VX.Destruction.VoxelDestructor)
        ) as VX.Destruction.VoxelDestructor;
        this.voxelDestructor = vc;
        this.voxelVolume = this.bindTo.GetComponent(
            puerts.$typeof(VX.Engine.VoxelVolume)
        ) as VX.Engine.VoxelVolume;

        if (vc && this.voxelVolume) {
            const originalN = VX.Mod.ModAPI.GetVoxelOriginalSolidCount(this.voxelVolume);
            CS.UnityEngine.Debug.Log('MechMuscle Init ' + this.bindTo.name + ' blockN ' + originalN);

            this.fragmentedHandler = () => {
                if (!this.voxelVolume || originalN <= 0) {
                    return;
                }

                if (VX.Mod.ModAPI.GetVoxelSolidRatio(this.voxelVolume) < 0.8) {
                    if (this.joint) {
                        CS.UnityEngine.Object.Destroy(this.joint);
                        this.joint = null;
                    }
                    if (this.mechController) {
                        this.mechController.enableFloating = false;
                    }
                }
            };
            // VX.Mod.ModAPI.AddVoxelFragmentedListener(vc, this.fragmentedHandler);
        } else {
            CS.UnityEngine.Debug.LogError(
                'MechMuscle Init VC VD not initialized ' + vc + ' ' + this.voxelVolume
            );
        }

        this.bindTo.onCollisionEnter = (other) => this.onCollisionEnter(other);
        this.bindTo.onCollisionExit = (other) => this.onCollisionExit(other);
        this.bindTo.onStart = () => this.onStart();
        this.bindTo.onDestroy = () => this.onDestroy();
    }

    private onDestroy(): void {
        if (this.voxelDestructor && this.fragmentedHandler) {
            VX.Mod.ModAPI.RemoveVoxelFragmentedListener(this.voxelDestructor, this.fragmentedHandler);
        }
        this.fragmentedHandler = null;
    }

    private onCollisionEnter(other: CS.Px5.UnityExtensions.Collision): void {
        const rb = other.collider.attachedRigidbody;
        if (rb && rb.isKinematic) {
            if (this.mechController) {
                this.mechController.collidedFloorMuscleCount++;
                // CS.UnityEngine.Debug.Log('MechMuscle onCollisionEnter with ' + rb + ' C ' + this.mechController.collidedFloorMuscleCount);
                // Giz.draw.PushDuration(3);
                // var c = other.contacts.get_Item(0);
                // Giz.DrawLabel(c.point, "EnterCol2 Self["+ c.thisCollider.attachedRigidbody.name +"] Rb " + rb.name + " Kin " + rb.isKinematic + " MC " + this.mechController);
                // Giz.draw.PopDuration();
            }
        }
    }

    private onCollisionExit(other: CS.Px5.UnityExtensions.Collision): void {
        const rb = other.collider.attachedRigidbody;
        if (rb && rb.isKinematic) {
            if (this.mechController) {
                this.mechController.collidedFloorMuscleCount--;
                // CS.UnityEngine.Debug.Log('MechMuscle onCollisionExit with ' + rb + ' C ' + this.mechController.collidedFloorMuscleCount);
                // Giz.draw.PushDuration(3);
                // var c = other.contacts.get_Item(0);
                // Giz.DrawLabel(c.point, "ExitCol " + this.mechController.collidedFloorMuscleCount);
                // Giz.draw.PopDuration();
            }
        }
    }
}
