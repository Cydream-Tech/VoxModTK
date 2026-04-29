const JsPropertiesType = puerts.$typeof(VX.Mod.JsProperties);

/**
 * Plays the configured BGM sound event when scenes load and unload.
 */
export class SampleBGM {
    private readonly bindTo: VX.Mod.JsComponentProxy;
    private readonly sceneLoadedHandler: CS.UnityEngine.Events.UnityAction;
    private readonly sceneUnloadedHandler: CS.UnityEngine.Events.UnityAction;

    private bgmSoundEvent: CS.Sonity.SoundEvent | null = null;

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        this.bindTo = bindTo;
        this.sceneLoadedHandler = new CS.UnityEngine.Events.UnityAction(() => this.playBgm());
        this.sceneUnloadedHandler = new CS.UnityEngine.Events.UnityAction(() => this.playBgm());

        this.bindTo.onStart = () => this.onStart();
        this.bindTo.onDestroy = () => this.onDestroy();
    }

    private onStart(): void {
        this.readProperties();
        this.subscribeSceneEvents();
    }

    private onDestroy(): void {
        this.unsubscribeSceneEvents();
        this.stopBgm();
    }

    private readProperties(): void {
        const props = this.bindTo.GetComponent(JsPropertiesType) as VX.Mod.JsProperties | null;
        if (props == null) {
            return;
        }

        const pairs = props.Pairs;
        for (let i = 0; i < pairs.Length; i++) {
            const pair = pairs.get_Item(i);
            const value = pair.value as any;

            if (pair.key === "bgm" && value != null) {
                this.bgmSoundEvent = value as CS.Sonity.SoundEvent;
                return;
            }
        }
    }

    private subscribeSceneEvents(): void {
        VX.Mod.ModAPI.OnSceneLoaded.AddListener(this.sceneLoadedHandler);
        VX.Mod.ModAPI.OnSceneUnloaded.AddListener(this.sceneUnloadedHandler);
    }

    private unsubscribeSceneEvents(): void {
        VX.Mod.ModAPI.OnSceneLoaded.RemoveListener(this.sceneLoadedHandler);
        VX.Mod.ModAPI.OnSceneUnloaded.RemoveListener(this.sceneUnloadedHandler);
    }

    private playBgm(): void {
        const soundEvent = this.bgmSoundEvent;
        if (soundEvent == null) {
            VX.Mod.ModAPI.Log("SampleBGM: missing 'bgm' SoundEvent on JsProperties.");
            return;
        }

        VX.Mod.ModAPI.PopBgm(soundEvent, VX.Sound.BgmPriority.LevelCustom);
        VX.Mod.ModAPI.PushBgm(soundEvent, VX.Sound.BgmPriority.LevelCustom);
    }

    private stopBgm(): void {
        const soundEvent = this.bgmSoundEvent;
        if (soundEvent == null) {
            return;
        }

        VX.Mod.ModAPI.PopBgm(soundEvent, VX.Sound.BgmPriority.LevelCustom);
    }
}
