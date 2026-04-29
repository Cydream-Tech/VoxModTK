export class Maths {
    public static SetX(v: CS.UnityEngine.Vector3, x: number): CS.UnityEngine.Vector3 {
        v.x = x;
        return v;
    }

    public static SetY(v: CS.UnityEngine.Vector3, y: number): CS.UnityEngine.Vector3 {
        v.y = y;
        return v;
    }

    public static SetZ(v: CS.UnityEngine.Vector3, z: number): CS.UnityEngine.Vector3 {
        v.z = z;
        return v;
    }

    public static SetElement(v: CS.UnityEngine.Vector3, ele: number, val: number): CS.UnityEngine.Vector3 {
        v.set_Item(ele, val);
        return v;
    }

    public static MulX(v: CS.UnityEngine.Vector3, mul: number): CS.UnityEngine.Vector3 {
        v.x *= mul;
        return v;
    }

    public static MulY(v: CS.UnityEngine.Vector3, mul: number): CS.UnityEngine.Vector3 {
        v.y *= mul;
        return v;
    }

    public static MulZ(v: CS.UnityEngine.Vector3, mul: number): CS.UnityEngine.Vector3 {
        v.z *= mul;
        return v;
    }

    public static MulXZ(v: CS.UnityEngine.Vector3, mul: number): CS.UnityEngine.Vector3 {
        v.x *= mul;
        v.z *= mul;
        return v;
    }

    public static xy(v: CS.UnityEngine.Vector3): CS.UnityEngine.Vector2 {
        return new CS.UnityEngine.Vector2(v.x, v.y);
    }

    public static xz(v: CS.UnityEngine.Vector3): CS.UnityEngine.Vector2 {
        return new CS.UnityEngine.Vector2(v.x, v.z);
    }

    public static x0y(v: CS.UnityEngine.Vector2): CS.UnityEngine.Vector3 {
        return new CS.UnityEngine.Vector3(v.x, 0, v.y);
    }

    public static xy0(v: CS.UnityEngine.Vector2): CS.UnityEngine.Vector3 {
        return new CS.UnityEngine.Vector3(v.x, v.y, 0);
    }

    public static abs(v: number): number {
        return CS.UnityEngine.Mathf.Abs(v);
    }

    public static ClampMaxMagnitude(v: CS.UnityEngine.Vector3, radiusMax: number): CS.UnityEngine.Vector3 {
        if (v.sqrMagnitude > radiusMax * radiusMax) {
            return CS.UnityEngine.Vector3.op_Multiply(v.normalized, radiusMax);
        }

        return v;
    }

    public static ClampMinMagnitude(v: CS.UnityEngine.Vector3, radiusMin: number): CS.UnityEngine.Vector3 {
        if (v.sqrMagnitude < radiusMin * radiusMin) {
            return CS.UnityEngine.Vector3.op_Multiply(v.normalized, radiusMin);
        }

        return v;
    }

    public static ClampMagnitude(
        v: CS.UnityEngine.Vector3,
        radiusMin: number,
        radiusMax: number
    ): CS.UnityEngine.Vector3 {
        return Maths.ClampMaxMagnitude(Maths.ClampMinMagnitude(v, radiusMin), radiusMax);
    }

    public static ClampMin(value: number, min: number): number {
        return CS.UnityEngine.Mathf.Max(value, min);
    }

    public static ClampMax(value: number, max: number): number {
        return CS.UnityEngine.Mathf.Min(value, max);
    }

    public static Clamp(value: number, minMax: CS.UnityEngine.Vector2): number;
    public static Clamp(value: number, min: number, max: number): number;
    public static Clamp(value: number, minOrMinMax: number | CS.UnityEngine.Vector2, max?: number): number {
        if (typeof minOrMinMax === "number") {
            if (max === undefined) {
                throw new Error("Maths.Clamp requires both min and max when using numeric bounds.");
            }

            return CS.UnityEngine.Mathf.Clamp(value, minOrMinMax, max);
        }

        return CS.UnityEngine.Mathf.Clamp(value, minOrMinMax.x, minOrMinMax.y);
    }
}
