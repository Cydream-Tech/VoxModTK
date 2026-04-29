const JsPropertiesType = puerts.$typeof(VX.Mod.JsProperties);

/**
 * SampleUI component implementation using JsComponentProxy.
 * This is a minimal example that demonstrates the basic pattern.
 */
export class SampleUI {
    private bindTo: VX.Mod.JsComponentProxy;
    private button: CS.UnityEngine.UI.Button | null = null;
    private text: CS.TMPro.TMP_Text | null = null;
    private clickHandler: CS.UnityEngine.Events.UnityAction | null = null;
    private value = 0;

    constructor(bindTo: VX.Mod.JsComponentProxy) {
        CS.UnityEngine.Debug.Log("SampleUI constructor");
        this.bindTo = bindTo;

        this.bindJsProperties();
        this.setupButton();

        // Bind update callback
        this.bindTo.onUpdate = (dt) => this.onUpdate(dt);
        this.bindTo.onDestroy = () => this.onDestroy();
        CS.UnityEngine.Debug.Log("SampleUI initialized");
    }

    private onUpdate(deltaTime: number): void {
        // Add your update logic here
    }

    private onDestroy(): void {
        if (this.button != null && this.clickHandler != null) {
            this.button.onClick.RemoveListener(this.clickHandler);
        }
    }

    private bindJsProperties(): void {
        const jsProperties = this.bindTo.GetComponent(JsPropertiesType) as VX.Mod.JsProperties | null;
        if (jsProperties == null) {
            CS.UnityEngine.Debug.LogError("SampleUI: JsProperties component not found.");
            return;
        }

        const pairs = jsProperties.Pairs;
        for (let i = 0; i < pairs.Length; i++) {
            const pair = pairs.get_Item(i);
            if (pair.key === "button") {
                var type = puerts.$typeof(CS.UnityEngine.UI.Button);
                this.button = pair.value.GetComponent(type) as CS.UnityEngine.UI.Button;
            } else if (pair.key === "text") {
                var type = puerts.$typeof(CS.TMPro.TMP_Text);
                this.text = pair.value.GetComponent(type);
            }
        }
    }

    private setupButton(): void {
        if (this.button == null) {
            CS.UnityEngine.Debug.LogError("SampleUI: JsProperty 'button' is not assigned.");
            return;
        }

        if (this.text == null) {
            CS.UnityEngine.Debug.LogError("SampleUI: JsProperty 'text' is not assigned.");
            return;
        }

        const parsedValue = Number.parseInt(this.text.text, 10);
        this.value = Number.isNaN(parsedValue) ? 0 : parsedValue;
        this.refreshText();

        this.clickHandler = new CS.UnityEngine.Events.UnityAction(() => {
            this.value += 1;
            this.refreshText();
        });
        this.button.onClick.AddListener(this.clickHandler);
    }

    private refreshText(): void {
        if (this.text != null) {
            this.text.text = this.value.toString();
        }
    }
}
