
    declare namespace CS {
    //keep type incompatibility / 此属性保持类型不兼容
    const __keep_incompatibility: unique symbol;
    interface $Ref<T> {
        __doNoAccess: T
    }
    namespace System {
        interface Array$1<T> extends System.Array {
            get_Item(index: number):T;
            set_Item(index: number, value: T):void;
        }
    }
    interface $Task<T> {}
    namespace System {
        class Object
        {
            protected [__keep_incompatibility]: never;
        }
        class ValueType extends System.Object
        {
            protected [__keep_incompatibility]: never;
        }
        class Int32 extends System.ValueType implements System.IFormattable, System.ISpanFormattable, System.IComparable, System.IComparable$1<number>, System.IConvertible, System.IEquatable$1<number>
        {
            protected [__keep_incompatibility]: never;
        }
        interface IFormattable
        {
        }
        interface ISpanFormattable
        {
        }
        interface IComparable
        {
        }
        interface IComparable$1<T>
        {
        }
        interface IConvertible
        {
        }
        interface IEquatable$1<T>
        {
        }
        class Void extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        class Boolean extends System.ValueType implements System.IComparable, System.IComparable$1<boolean>, System.IConvertible, System.IEquatable$1<boolean>
        {
            protected [__keep_incompatibility]: never;
        }
        class Delegate extends System.Object implements System.Runtime.Serialization.ISerializable, System.ICloneable
        {
            protected [__keep_incompatibility]: never;
        }
        interface ICloneable
        {
        }
        interface MulticastDelegate
        { 
        (...args:any[]) : any; 
        Invoke?: (...args:any[]) => any;
        }
        var MulticastDelegate: { new (func: (...args:any[]) => any): MulticastDelegate; }
        interface Converter$2<TInput, TOutput>
        { 
        (input: TInput) : TOutput; 
        Invoke?: (input: TInput) => TOutput;
        }
        class Array extends System.Object implements System.Collections.IStructuralComparable, System.Collections.IStructuralEquatable, System.ICloneable, System.Collections.ICollection, System.Collections.IEnumerable, System.Collections.IList
        {
            protected [__keep_incompatibility]: never;
            public get LongLength(): bigint;
            public get IsFixedSize(): boolean;
            public get IsReadOnly(): boolean;
            public get IsSynchronized(): boolean;
            public get SyncRoot(): any;
            public get Length(): number;
            public get Rank(): number;
            public static CreateInstance ($elementType: System.Type, ...lengths: bigint[]) : System.Array
            public CopyTo ($array: System.Array, $index: number) : void
            public Clone () : any
            public static BinarySearch ($array: System.Array, $value: any) : number
            public static Copy ($sourceArray: System.Array, $destinationArray: System.Array, $length: bigint) : void
            public static Copy ($sourceArray: System.Array, $sourceIndex: bigint, $destinationArray: System.Array, $destinationIndex: bigint, $length: bigint) : void
            public CopyTo ($array: System.Array, $index: bigint) : void
            public GetLongLength ($dimension: number) : bigint
            public GetValue ($index: bigint) : any
            public GetValue ($index1: bigint, $index2: bigint) : any
            public GetValue ($index1: bigint, $index2: bigint, $index3: bigint) : any
            public GetValue (...indices: bigint[]) : any
            public static BinarySearch ($array: System.Array, $index: number, $length: number, $value: any) : number
            public static BinarySearch ($array: System.Array, $value: any, $comparer: System.Collections.IComparer) : number
            public static BinarySearch ($array: System.Array, $index: number, $length: number, $value: any, $comparer: System.Collections.IComparer) : number
            public static IndexOf ($array: System.Array, $value: any) : number
            public static IndexOf ($array: System.Array, $value: any, $startIndex: number) : number
            public static IndexOf ($array: System.Array, $value: any, $startIndex: number, $count: number) : number
            public static LastIndexOf ($array: System.Array, $value: any) : number
            public static LastIndexOf ($array: System.Array, $value: any, $startIndex: number) : number
            public static LastIndexOf ($array: System.Array, $value: any, $startIndex: number, $count: number) : number
            public static Reverse ($array: System.Array) : void
            public static Reverse ($array: System.Array, $index: number, $length: number) : void
            public SetValue ($value: any, $index: bigint) : void
            public SetValue ($value: any, $index1: bigint, $index2: bigint) : void
            public SetValue ($value: any, $index1: bigint, $index2: bigint, $index3: bigint) : void
            public SetValue ($value: any, ...indices: bigint[]) : void
            public static Sort ($array: System.Array) : void
            public static Sort ($array: System.Array, $index: number, $length: number) : void
            public static Sort ($array: System.Array, $comparer: System.Collections.IComparer) : void
            public static Sort ($array: System.Array, $index: number, $length: number, $comparer: System.Collections.IComparer) : void
            public static Sort ($keys: System.Array, $items: System.Array) : void
            public static Sort ($keys: System.Array, $items: System.Array, $comparer: System.Collections.IComparer) : void
            public static Sort ($keys: System.Array, $items: System.Array, $index: number, $length: number) : void
            public static Sort ($keys: System.Array, $items: System.Array, $index: number, $length: number, $comparer: System.Collections.IComparer) : void
            public GetEnumerator () : System.Collections.IEnumerator
            public GetLength ($dimension: number) : number
            public GetLowerBound ($dimension: number) : number
            public GetValue (...indices: number[]) : any
            public SetValue ($value: any, ...indices: number[]) : void
            public GetUpperBound ($dimension: number) : number
            public GetValue ($index: number) : any
            public GetValue ($index1: number, $index2: number) : any
            public GetValue ($index1: number, $index2: number, $index3: number) : any
            public SetValue ($value: any, $index: number) : void
            public SetValue ($value: any, $index1: number, $index2: number) : void
            public SetValue ($value: any, $index1: number, $index2: number, $index3: number) : void
            public static CreateInstance ($elementType: System.Type, $length: number) : System.Array
            public static CreateInstance ($elementType: System.Type, $length1: number, $length2: number) : System.Array
            public static CreateInstance ($elementType: System.Type, $length1: number, $length2: number, $length3: number) : System.Array
            public static CreateInstance ($elementType: System.Type, ...lengths: number[]) : System.Array
            public static CreateInstance ($elementType: System.Type, $lengths: System.Array$1<number>, $lowerBounds: System.Array$1<number>) : System.Array
            public static Clear ($array: System.Array, $index: number, $length: number) : void
            public static Copy ($sourceArray: System.Array, $destinationArray: System.Array, $length: number) : void
            public static Copy ($sourceArray: System.Array, $sourceIndex: number, $destinationArray: System.Array, $destinationIndex: number, $length: number) : void
            public static ConstrainedCopy ($sourceArray: System.Array, $sourceIndex: number, $destinationArray: System.Array, $destinationIndex: number, $length: number) : void
            public Initialize () : void
        }
        interface Predicate$1<T>
        { 
        (obj: T) : boolean; 
        Invoke?: (obj: T) => boolean;
        }
        interface Action$1<T>
        { 
        (obj: T) : void; 
        Invoke?: (obj: T) => void;
        }
        interface IDisposable
        {
        }
        interface Comparison$1<T>
        { 
        (x: T, y: T) : number; 
        Invoke?: (x: T, y: T) => number;
        }
        class Single extends System.ValueType implements System.IFormattable, System.ISpanFormattable, System.IComparable, System.IComparable$1<number>, System.IConvertible, System.IEquatable$1<number>
        {
            protected [__keep_incompatibility]: never;
        }
        class String extends System.Object implements System.ICloneable, System.IComparable, System.IComparable$1<string>, System.IConvertible, System.Collections.Generic.IEnumerable$1<number>, System.Collections.IEnumerable, System.IEquatable$1<string>
        {
            protected [__keep_incompatibility]: never;
        }
        class Char extends System.ValueType implements System.IComparable, System.IComparable$1<number>, System.IConvertible, System.IEquatable$1<number>
        {
            protected [__keep_incompatibility]: never;
        }
        class Type extends System.Reflection.MemberInfo implements System.Runtime.InteropServices._MemberInfo, System.Runtime.InteropServices._Type, System.Reflection.ICustomAttributeProvider, System.Reflection.IReflect
        {
            protected [__keep_incompatibility]: never;
            public static Delimiter : number
            public static EmptyTypes : System.Array$1<System.Type>
            public static Missing : any
            public static FilterAttribute : System.Reflection.MemberFilter
            public static FilterName : System.Reflection.MemberFilter
            public static FilterNameIgnoreCase : System.Reflection.MemberFilter
            public get IsSerializable(): boolean;
            public get ContainsGenericParameters(): boolean;
            public get IsVisible(): boolean;
            public get MemberType(): System.Reflection.MemberTypes;
            public get Namespace(): string;
            public get AssemblyQualifiedName(): string;
            public get FullName(): string;
            public get Assembly(): System.Reflection.Assembly;
            public get Module(): System.Reflection.Module;
            public get IsNested(): boolean;
            public get DeclaringType(): System.Type;
            public get DeclaringMethod(): System.Reflection.MethodBase;
            public get ReflectedType(): System.Type;
            public get UnderlyingSystemType(): System.Type;
            public get IsTypeDefinition(): boolean;
            public get IsArray(): boolean;
            public get IsByRef(): boolean;
            public get IsPointer(): boolean;
            public get IsConstructedGenericType(): boolean;
            public get IsGenericParameter(): boolean;
            public get IsGenericTypeParameter(): boolean;
            public get IsGenericMethodParameter(): boolean;
            public get IsGenericType(): boolean;
            public get IsGenericTypeDefinition(): boolean;
            public get IsVariableBoundArray(): boolean;
            public get IsByRefLike(): boolean;
            public get HasElementType(): boolean;
            public get GenericTypeArguments(): System.Array$1<System.Type>;
            public get GenericParameterPosition(): number;
            public get GenericParameterAttributes(): System.Reflection.GenericParameterAttributes;
            public get Attributes(): System.Reflection.TypeAttributes;
            public get IsAbstract(): boolean;
            public get IsImport(): boolean;
            public get IsSealed(): boolean;
            public get IsSpecialName(): boolean;
            public get IsClass(): boolean;
            public get IsNestedAssembly(): boolean;
            public get IsNestedFamANDAssem(): boolean;
            public get IsNestedFamily(): boolean;
            public get IsNestedFamORAssem(): boolean;
            public get IsNestedPrivate(): boolean;
            public get IsNestedPublic(): boolean;
            public get IsNotPublic(): boolean;
            public get IsPublic(): boolean;
            public get IsAutoLayout(): boolean;
            public get IsExplicitLayout(): boolean;
            public get IsLayoutSequential(): boolean;
            public get IsAnsiClass(): boolean;
            public get IsAutoClass(): boolean;
            public get IsUnicodeClass(): boolean;
            public get IsCOMObject(): boolean;
            public get IsContextful(): boolean;
            public get IsCollectible(): boolean;
            public get IsEnum(): boolean;
            public get IsMarshalByRef(): boolean;
            public get IsPrimitive(): boolean;
            public get IsValueType(): boolean;
            public get IsSignatureType(): boolean;
            public get IsSecurityCritical(): boolean;
            public get IsSecuritySafeCritical(): boolean;
            public get IsSecurityTransparent(): boolean;
            public get StructLayoutAttribute(): System.Runtime.InteropServices.StructLayoutAttribute;
            public get TypeInitializer(): System.Reflection.ConstructorInfo;
            public get TypeHandle(): System.RuntimeTypeHandle;
            public get GUID(): System.Guid;
            public get BaseType(): System.Type;
            public static get DefaultBinder(): System.Reflection.Binder;
            public get IsInterface(): boolean;
            public IsEnumDefined ($value: any) : boolean
            public GetEnumName ($value: any) : string
            public GetEnumNames () : System.Array$1<string>
            public FindInterfaces ($filter: System.Reflection.TypeFilter, $filterCriteria: any) : System.Array$1<System.Type>
            public FindMembers ($memberType: System.Reflection.MemberTypes, $bindingAttr: System.Reflection.BindingFlags, $filter: System.Reflection.MemberFilter, $filterCriteria: any) : System.Array$1<System.Reflection.MemberInfo>
            public IsSubclassOf ($c: System.Type) : boolean
            public IsAssignableFrom ($c: System.Type) : boolean
            public GetType () : System.Type
            public GetElementType () : System.Type
            public GetArrayRank () : number
            public GetGenericTypeDefinition () : System.Type
            public GetGenericArguments () : System.Array$1<System.Type>
            public GetGenericParameterConstraints () : System.Array$1<System.Type>
            public GetConstructor ($types: System.Array$1<System.Type>) : System.Reflection.ConstructorInfo
            public GetConstructor ($bindingAttr: System.Reflection.BindingFlags, $binder: System.Reflection.Binder, $types: System.Array$1<System.Type>, $modifiers: System.Array$1<System.Reflection.ParameterModifier>) : System.Reflection.ConstructorInfo
            public GetConstructor ($bindingAttr: System.Reflection.BindingFlags, $binder: System.Reflection.Binder, $callConvention: System.Reflection.CallingConventions, $types: System.Array$1<System.Type>, $modifiers: System.Array$1<System.Reflection.ParameterModifier>) : System.Reflection.ConstructorInfo
            public GetConstructors () : System.Array$1<System.Reflection.ConstructorInfo>
            public GetConstructors ($bindingAttr: System.Reflection.BindingFlags) : System.Array$1<System.Reflection.ConstructorInfo>
            public GetEvent ($name: string) : System.Reflection.EventInfo
            public GetEvent ($name: string, $bindingAttr: System.Reflection.BindingFlags) : System.Reflection.EventInfo
            public GetEvents () : System.Array$1<System.Reflection.EventInfo>
            public GetEvents ($bindingAttr: System.Reflection.BindingFlags) : System.Array$1<System.Reflection.EventInfo>
            public GetField ($name: string) : System.Reflection.FieldInfo
            public GetField ($name: string, $bindingAttr: System.Reflection.BindingFlags) : System.Reflection.FieldInfo
            public GetFields () : System.Array$1<System.Reflection.FieldInfo>
            public GetFields ($bindingAttr: System.Reflection.BindingFlags) : System.Array$1<System.Reflection.FieldInfo>
            public GetMember ($name: string) : System.Array$1<System.Reflection.MemberInfo>
            public GetMember ($name: string, $bindingAttr: System.Reflection.BindingFlags) : System.Array$1<System.Reflection.MemberInfo>
            public GetMember ($name: string, $type: System.Reflection.MemberTypes, $bindingAttr: System.Reflection.BindingFlags) : System.Array$1<System.Reflection.MemberInfo>
            public GetMembers () : System.Array$1<System.Reflection.MemberInfo>
            public GetMembers ($bindingAttr: System.Reflection.BindingFlags) : System.Array$1<System.Reflection.MemberInfo>
            public GetMethod ($name: string) : System.Reflection.MethodInfo
            public GetMethod ($name: string, $bindingAttr: System.Reflection.BindingFlags) : System.Reflection.MethodInfo
            public GetMethod ($name: string, $types: System.Array$1<System.Type>) : System.Reflection.MethodInfo
            public GetMethod ($name: string, $types: System.Array$1<System.Type>, $modifiers: System.Array$1<System.Reflection.ParameterModifier>) : System.Reflection.MethodInfo
            public GetMethod ($name: string, $bindingAttr: System.Reflection.BindingFlags, $binder: System.Reflection.Binder, $types: System.Array$1<System.Type>, $modifiers: System.Array$1<System.Reflection.ParameterModifier>) : System.Reflection.MethodInfo
            public GetMethod ($name: string, $bindingAttr: System.Reflection.BindingFlags, $binder: System.Reflection.Binder, $callConvention: System.Reflection.CallingConventions, $types: System.Array$1<System.Type>, $modifiers: System.Array$1<System.Reflection.ParameterModifier>) : System.Reflection.MethodInfo
            public GetMethod ($name: string, $genericParameterCount: number, $types: System.Array$1<System.Type>) : System.Reflection.MethodInfo
            public GetMethod ($name: string, $genericParameterCount: number, $types: System.Array$1<System.Type>, $modifiers: System.Array$1<System.Reflection.ParameterModifier>) : System.Reflection.MethodInfo
            public GetMethod ($name: string, $genericParameterCount: number, $bindingAttr: System.Reflection.BindingFlags, $binder: System.Reflection.Binder, $types: System.Array$1<System.Type>, $modifiers: System.Array$1<System.Reflection.ParameterModifier>) : System.Reflection.MethodInfo
            public GetMethod ($name: string, $genericParameterCount: number, $bindingAttr: System.Reflection.BindingFlags, $binder: System.Reflection.Binder, $callConvention: System.Reflection.CallingConventions, $types: System.Array$1<System.Type>, $modifiers: System.Array$1<System.Reflection.ParameterModifier>) : System.Reflection.MethodInfo
            public GetMethods () : System.Array$1<System.Reflection.MethodInfo>
            public GetMethods ($bindingAttr: System.Reflection.BindingFlags) : System.Array$1<System.Reflection.MethodInfo>
            public GetNestedType ($name: string) : System.Type
            public GetNestedType ($name: string, $bindingAttr: System.Reflection.BindingFlags) : System.Type
            public GetNestedTypes () : System.Array$1<System.Type>
            public GetNestedTypes ($bindingAttr: System.Reflection.BindingFlags) : System.Array$1<System.Type>
            public GetProperty ($name: string) : System.Reflection.PropertyInfo
            public GetProperty ($name: string, $bindingAttr: System.Reflection.BindingFlags) : System.Reflection.PropertyInfo
            public GetProperty ($name: string, $returnType: System.Type) : System.Reflection.PropertyInfo
            public GetProperty ($name: string, $types: System.Array$1<System.Type>) : System.Reflection.PropertyInfo
            public GetProperty ($name: string, $returnType: System.Type, $types: System.Array$1<System.Type>) : System.Reflection.PropertyInfo
            public GetProperty ($name: string, $returnType: System.Type, $types: System.Array$1<System.Type>, $modifiers: System.Array$1<System.Reflection.ParameterModifier>) : System.Reflection.PropertyInfo
            public GetProperty ($name: string, $bindingAttr: System.Reflection.BindingFlags, $binder: System.Reflection.Binder, $returnType: System.Type, $types: System.Array$1<System.Type>, $modifiers: System.Array$1<System.Reflection.ParameterModifier>) : System.Reflection.PropertyInfo
            public GetProperties () : System.Array$1<System.Reflection.PropertyInfo>
            public GetProperties ($bindingAttr: System.Reflection.BindingFlags) : System.Array$1<System.Reflection.PropertyInfo>
            public GetDefaultMembers () : System.Array$1<System.Reflection.MemberInfo>
            public static GetTypeHandle ($o: any) : System.RuntimeTypeHandle
            public static GetTypeArray ($args: System.Array$1<any>) : System.Array$1<System.Type>
            public static GetTypeCode ($type: System.Type) : System.TypeCode
            public static GetTypeFromCLSID ($clsid: System.Guid) : System.Type
            public static GetTypeFromCLSID ($clsid: System.Guid, $throwOnError: boolean) : System.Type
            public static GetTypeFromCLSID ($clsid: System.Guid, $server: string) : System.Type
            public static GetTypeFromProgID ($progID: string) : System.Type
            public static GetTypeFromProgID ($progID: string, $throwOnError: boolean) : System.Type
            public static GetTypeFromProgID ($progID: string, $server: string) : System.Type
            public InvokeMember ($name: string, $invokeAttr: System.Reflection.BindingFlags, $binder: System.Reflection.Binder, $target: any, $args: System.Array$1<any>) : any
            public InvokeMember ($name: string, $invokeAttr: System.Reflection.BindingFlags, $binder: System.Reflection.Binder, $target: any, $args: System.Array$1<any>, $culture: System.Globalization.CultureInfo) : any
            public InvokeMember ($name: string, $invokeAttr: System.Reflection.BindingFlags, $binder: System.Reflection.Binder, $target: any, $args: System.Array$1<any>, $modifiers: System.Array$1<System.Reflection.ParameterModifier>, $culture: System.Globalization.CultureInfo, $namedParameters: System.Array$1<string>) : any
            public GetInterface ($name: string) : System.Type
            public GetInterface ($name: string, $ignoreCase: boolean) : System.Type
            public GetInterfaces () : System.Array$1<System.Type>
            public GetInterfaceMap ($interfaceType: System.Type) : System.Reflection.InterfaceMapping
            public IsInstanceOfType ($o: any) : boolean
            public IsEquivalentTo ($other: System.Type) : boolean
            public GetEnumUnderlyingType () : System.Type
            public GetEnumValues () : System.Array
            public MakeArrayType () : System.Type
            public MakeArrayType ($rank: number) : System.Type
            public MakeByRefType () : System.Type
            public MakeGenericType (...typeArguments: System.Type[]) : System.Type
            public MakePointerType () : System.Type
            public static MakeGenericSignatureType ($genericTypeDefinition: System.Type, ...typeArguments: System.Type[]) : System.Type
            public static MakeGenericMethodParameter ($position: number) : System.Type
            public Equals ($o: any) : boolean
            public Equals ($o: System.Type) : boolean
            public static GetTypeFromHandle ($handle: System.RuntimeTypeHandle) : System.Type
            public static GetType ($typeName: string, $throwOnError: boolean, $ignoreCase: boolean) : System.Type
            public static GetType ($typeName: string, $throwOnError: boolean) : System.Type
            public static GetType ($typeName: string) : System.Type
            public static GetType ($typeName: string, $assemblyResolver: System.Func$2<System.Reflection.AssemblyName, System.Reflection.Assembly>, $typeResolver: System.Func$4<System.Reflection.Assembly, string, boolean, System.Type>) : System.Type
            public static GetType ($typeName: string, $assemblyResolver: System.Func$2<System.Reflection.AssemblyName, System.Reflection.Assembly>, $typeResolver: System.Func$4<System.Reflection.Assembly, string, boolean, System.Type>, $throwOnError: boolean) : System.Type
            public static GetType ($typeName: string, $assemblyResolver: System.Func$2<System.Reflection.AssemblyName, System.Reflection.Assembly>, $typeResolver: System.Func$4<System.Reflection.Assembly, string, boolean, System.Type>, $throwOnError: boolean, $ignoreCase: boolean) : System.Type
            public static op_Equality ($left: System.Type, $right: System.Type) : boolean
            public static op_Inequality ($left: System.Type, $right: System.Type) : boolean
            public static ReflectionOnlyGetType ($typeName: string, $throwIfNotFound: boolean, $ignoreCase: boolean) : System.Type
            public static GetTypeFromCLSID ($clsid: System.Guid, $server: string, $throwOnError: boolean) : System.Type
            public static GetTypeFromProgID ($progID: string, $server: string, $throwOnError: boolean) : System.Type
        }
        class Int64 extends System.ValueType implements System.IFormattable, System.ISpanFormattable, System.IComparable, System.IComparable$1<bigint>, System.IConvertible, System.IEquatable$1<bigint>
        {
            protected [__keep_incompatibility]: never;
        }
        interface Action
        { 
        () : void; 
        Invoke?: () => void;
        }
        var Action: { new (func: () => void): Action; }
        interface IAsyncResult
        {
        }
        interface AsyncCallback
        { 
        (ar: System.IAsyncResult) : void; 
        Invoke?: (ar: System.IAsyncResult) => void;
        }
        var AsyncCallback: { new (func: (ar: System.IAsyncResult) => void): AsyncCallback; }
        class IntPtr extends System.ValueType implements System.Runtime.Serialization.ISerializable, System.IEquatable$1<System.IntPtr>
        {
            protected [__keep_incompatibility]: never;
        }
        interface Func$1<TResult>
        { 
        () : TResult; 
        Invoke?: () => TResult;
        }
        interface IFormatProvider
        {
        }
        class Byte extends System.ValueType implements System.IFormattable, System.ISpanFormattable, System.IComparable, System.IComparable$1<number>, System.IConvertible, System.IEquatable$1<number>
        {
            protected [__keep_incompatibility]: never;
        }
        class Enum extends System.ValueType implements System.IFormattable, System.IComparable, System.IConvertible
        {
            protected [__keep_incompatibility]: never;
        }
        class ReadOnlySpan$1<T> extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        class UInt64 extends System.ValueType implements System.IFormattable, System.ISpanFormattable, System.IComparable, System.IComparable$1<bigint>, System.IConvertible, System.IEquatable$1<bigint>
        {
            protected [__keep_incompatibility]: never;
        }
        class Span$1<T> extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        class Exception extends System.Object implements System.Runtime.Serialization.ISerializable, System.Runtime.InteropServices._Exception
        {
            protected [__keep_incompatibility]: never;
        }
        class Double extends System.ValueType implements System.IFormattable, System.ISpanFormattable, System.IComparable, System.IComparable$1<number>, System.IConvertible, System.IEquatable$1<number>
        {
            protected [__keep_incompatibility]: never;
        }
        class UInt16 extends System.ValueType implements System.IFormattable, System.ISpanFormattable, System.IComparable, System.IComparable$1<number>, System.IConvertible, System.IEquatable$1<number>
        {
            protected [__keep_incompatibility]: never;
        }
        class UInt32 extends System.ValueType implements System.IFormattable, System.ISpanFormattable, System.IComparable, System.IComparable$1<number>, System.IConvertible, System.IEquatable$1<number>
        {
            protected [__keep_incompatibility]: never;
        }
        interface Func$3<T1, T2, TResult>
        { 
        (arg1: T1, arg2: T2) : TResult; 
        Invoke?: (arg1: T1, arg2: T2) => TResult;
        }
        class Attribute extends System.Object implements System.Runtime.InteropServices._Attribute
        {
            protected [__keep_incompatibility]: never;
        }
        class RuntimeTypeHandle extends System.ValueType implements System.Runtime.Serialization.ISerializable
        {
            protected [__keep_incompatibility]: never;
        }
        enum TypeCode
        { Empty = 0, Object = 1, DBNull = 2, Boolean = 3, Char = 4, SByte = 5, Byte = 6, Int16 = 7, UInt16 = 8, Int32 = 9, UInt32 = 10, Int64 = 11, UInt64 = 12, Single = 13, Double = 14, Decimal = 15, DateTime = 16, String = 18 }
        class Guid extends System.ValueType implements System.IFormattable, System.ISpanFormattable, System.IComparable, System.IComparable$1<System.Guid>, System.IEquatable$1<System.Guid>
        {
            protected [__keep_incompatibility]: never;
        }
        interface Func$2<T, TResult>
        { 
        (arg: T) : TResult; 
        Invoke?: (arg: T) => TResult;
        }
        interface Func$4<T1, T2, T3, TResult>
        { 
        (arg1: T1, arg2: T2, arg3: T3) : TResult; 
        Invoke?: (arg1: T1, arg2: T2, arg3: T3) => TResult;
        }
    }
    namespace System.Collections.Generic {
        class List$1<T> extends System.Object implements System.Collections.Generic.IReadOnlyList$1<T>, System.Collections.ICollection, System.Collections.Generic.IEnumerable$1<T>, System.Collections.IEnumerable, System.Collections.Generic.IList$1<T>, System.Collections.Generic.IReadOnlyCollection$1<T>, System.Collections.IList, System.Collections.Generic.ICollection$1<T>
        {
            protected [__keep_incompatibility]: never;
            public get Capacity(): number;
            public set Capacity(value: number);
            public get Count(): number;
            public get_Item ($index: number) : T
            public set_Item ($index: number, $value: T) : void
            public Add ($item: T) : void
            public AddRange ($collection: System.Collections.Generic.IEnumerable$1<T>) : void
            public AsReadOnly () : System.Collections.ObjectModel.ReadOnlyCollection$1<T>
            public BinarySearch ($index: number, $count: number, $item: T, $comparer: System.Collections.Generic.IComparer$1<T>) : number
            public BinarySearch ($item: T) : number
            public BinarySearch ($item: T, $comparer: System.Collections.Generic.IComparer$1<T>) : number
            public Clear () : void
            public Contains ($item: T) : boolean
            public CopyTo ($array: System.Array$1<T>) : void
            public CopyTo ($index: number, $array: System.Array$1<T>, $arrayIndex: number, $count: number) : void
            public CopyTo ($array: System.Array$1<T>, $arrayIndex: number) : void
            public Exists ($match: System.Predicate$1<T>) : boolean
            public Find ($match: System.Predicate$1<T>) : T
            public FindAll ($match: System.Predicate$1<T>) : System.Collections.Generic.List$1<T>
            public FindIndex ($match: System.Predicate$1<T>) : number
            public FindIndex ($startIndex: number, $match: System.Predicate$1<T>) : number
            public FindIndex ($startIndex: number, $count: number, $match: System.Predicate$1<T>) : number
            public FindLast ($match: System.Predicate$1<T>) : T
            public FindLastIndex ($match: System.Predicate$1<T>) : number
            public FindLastIndex ($startIndex: number, $match: System.Predicate$1<T>) : number
            public FindLastIndex ($startIndex: number, $count: number, $match: System.Predicate$1<T>) : number
            public ForEach ($action: System.Action$1<T>) : void
            public GetEnumerator () : System.Collections.Generic.List$1.Enumerator<T>
            public GetRange ($index: number, $count: number) : System.Collections.Generic.List$1<T>
            public IndexOf ($item: T) : number
            public IndexOf ($item: T, $index: number) : number
            public IndexOf ($item: T, $index: number, $count: number) : number
            public Insert ($index: number, $item: T) : void
            public InsertRange ($index: number, $collection: System.Collections.Generic.IEnumerable$1<T>) : void
            public LastIndexOf ($item: T) : number
            public LastIndexOf ($item: T, $index: number) : number
            public LastIndexOf ($item: T, $index: number, $count: number) : number
            public Remove ($item: T) : boolean
            public RemoveAll ($match: System.Predicate$1<T>) : number
            public RemoveAt ($index: number) : void
            public RemoveRange ($index: number, $count: number) : void
            public Reverse () : void
            public Reverse ($index: number, $count: number) : void
            public Sort () : void
            public Sort ($comparer: System.Collections.Generic.IComparer$1<T>) : void
            public Sort ($index: number, $count: number, $comparer: System.Collections.Generic.IComparer$1<T>) : void
            public Sort ($comparison: System.Comparison$1<T>) : void
            public ToArray () : System.Array$1<T>
            public TrimExcess () : void
            public TrueForAll ($match: System.Predicate$1<T>) : boolean
            public constructor ()
            public constructor ($capacity: number)
            public constructor ($collection: System.Collections.Generic.IEnumerable$1<T>)
            public [Symbol.iterator]() : IterableIterator<T>
        }
        interface IReadOnlyList$1<T> extends System.Collections.Generic.IEnumerable$1<T>, System.Collections.IEnumerable, System.Collections.Generic.IReadOnlyCollection$1<T>
        {
        }
        interface IEnumerable$1<T> extends System.Collections.IEnumerable
        {
        }
        interface IReadOnlyCollection$1<T> extends System.Collections.Generic.IEnumerable$1<T>, System.Collections.IEnumerable
        {
        }
        interface IList$1<T> extends System.Collections.Generic.IEnumerable$1<T>, System.Collections.IEnumerable, System.Collections.Generic.ICollection$1<T>
        {
        }
        interface ICollection$1<T> extends System.Collections.Generic.IEnumerable$1<T>, System.Collections.IEnumerable
        {
        }
        interface IComparer$1<T>
        {
        }
        interface IEnumerator$1<T> extends System.Collections.IEnumerator, System.IDisposable
        {
        }
        class Dictionary$2<TKey, TValue> extends System.Object implements System.Runtime.Serialization.IDeserializationCallback, System.Collections.Generic.IReadOnlyDictionary$2<TKey, TValue>, System.Collections.Generic.IDictionary$2<TKey, TValue>, System.Runtime.Serialization.ISerializable, System.Collections.ICollection, System.Collections.IDictionary, System.Collections.Generic.IEnumerable$1<System.Collections.Generic.KeyValuePair$2<TKey, TValue>>, System.Collections.IEnumerable, System.Collections.Generic.IReadOnlyCollection$1<System.Collections.Generic.KeyValuePair$2<TKey, TValue>>, System.Collections.Generic.ICollection$1<System.Collections.Generic.KeyValuePair$2<TKey, TValue>>
        {
            protected [__keep_incompatibility]: never;
            public get Comparer(): System.Collections.Generic.IEqualityComparer$1<TKey>;
            public get Count(): number;
            public get Keys(): System.Collections.Generic.Dictionary$2.KeyCollection<TKey, TValue>;
            public get Values(): System.Collections.Generic.Dictionary$2.ValueCollection<TKey, TValue>;
            public get_Item ($key: TKey) : TValue
            public set_Item ($key: TKey, $value: TValue) : void
            public Add ($key: TKey, $value: TValue) : void
            public Clear () : void
            public ContainsKey ($key: TKey) : boolean
            public ContainsValue ($value: TValue) : boolean
            public GetEnumerator () : System.Collections.Generic.Dictionary$2.Enumerator<TKey, TValue>
            public GetObjectData ($info: System.Runtime.Serialization.SerializationInfo, $context: System.Runtime.Serialization.StreamingContext) : void
            public OnDeserialization ($sender: any) : void
            public Remove ($key: TKey) : boolean
            public TryGetValue ($key: TKey, $value: $Ref<TValue>) : boolean
            public EnsureCapacity ($capacity: number) : number
            public TrimExcess () : void
            public TrimExcess ($capacity: number) : void
            public constructor ()
            public constructor ($capacity: number)
            public constructor ($comparer: System.Collections.Generic.IEqualityComparer$1<TKey>)
            public constructor ($capacity: number, $comparer: System.Collections.Generic.IEqualityComparer$1<TKey>)
            public constructor ($dictionary: System.Collections.Generic.IDictionary$2<TKey, TValue>)
            public constructor ($dictionary: System.Collections.Generic.IDictionary$2<TKey, TValue>, $comparer: System.Collections.Generic.IEqualityComparer$1<TKey>)
            public constructor ($collection: System.Collections.Generic.IEnumerable$1<System.Collections.Generic.KeyValuePair$2<TKey, TValue>>)
            public constructor ($collection: System.Collections.Generic.IEnumerable$1<System.Collections.Generic.KeyValuePair$2<TKey, TValue>>, $comparer: System.Collections.Generic.IEqualityComparer$1<TKey>)
            public [Symbol.iterator]() : IterableIterator<System.Collections.Generic.KeyValuePair$2<TKey, TValue>>
        }
        interface IReadOnlyDictionary$2<TKey, TValue> extends System.Collections.Generic.IEnumerable$1<System.Collections.Generic.KeyValuePair$2<TKey, TValue>>, System.Collections.IEnumerable, System.Collections.Generic.IReadOnlyCollection$1<System.Collections.Generic.KeyValuePair$2<TKey, TValue>>
        {
        }
        class KeyValuePair$2<TKey, TValue> extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            public get Key(): TKey;
            public get Value(): TValue;
            public Deconstruct ($key: $Ref<TKey>, $value: $Ref<TValue>) : void
            public constructor ($key: TKey, $value: TValue)
        }
        interface IDictionary$2<TKey, TValue> extends System.Collections.Generic.IEnumerable$1<System.Collections.Generic.KeyValuePair$2<TKey, TValue>>, System.Collections.IEnumerable, System.Collections.Generic.ICollection$1<System.Collections.Generic.KeyValuePair$2<TKey, TValue>>
        {
        }
        interface IEqualityComparer$1<T>
        {
        }
    }
    namespace System.Collections {
        interface IEnumerable
        {
        }
        interface ICollection extends System.Collections.IEnumerable
        {
        }
        interface IList extends System.Collections.ICollection, System.Collections.IEnumerable
        {
        }
        interface IStructuralComparable
        {
        }
        interface IStructuralEquatable
        {
        }
        interface IEnumerator
        {
        }
        interface IComparer
        {
        }
        interface IDictionary extends System.Collections.ICollection, System.Collections.IEnumerable
        {
        }
        interface IDictionaryEnumerator extends System.Collections.IEnumerator
        {
        }
    }
    namespace System.Collections.ObjectModel {
        class ReadOnlyCollection$1<T> extends System.Object implements System.Collections.Generic.IReadOnlyList$1<T>, System.Collections.ICollection, System.Collections.Generic.IEnumerable$1<T>, System.Collections.IEnumerable, System.Collections.Generic.IList$1<T>, System.Collections.Generic.IReadOnlyCollection$1<T>, System.Collections.IList, System.Collections.Generic.ICollection$1<T>
        {
            protected [__keep_incompatibility]: never;
            public [Symbol.iterator]() : IterableIterator<T>
        }
    }
    namespace System.Runtime.Serialization {
        interface ISerializable
        {
        }
        interface IDeserializationCallback
        {
        }
        class SerializationInfo extends System.Object
        {
            protected [__keep_incompatibility]: never;
        }
        class StreamingContext extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace System.Collections.Generic.List$1 {
        class Enumerator<T> extends System.ValueType implements System.Collections.Generic.IEnumerator$1<T>, System.Collections.IEnumerator, System.IDisposable
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace UnityEngine {
        /** Representation of 2D vectors and points.
        */
        class Vector2 extends System.ValueType implements System.IFormattable, System.IEquatable$1<UnityEngine.Vector2>
        {
            protected [__keep_incompatibility]: never;
            /** X component of the vector.
            */
            public x : number
            /** Y component of the vector.
            */
            public y : number
            public static kEpsilon : number
            public static kEpsilonNormalSqrt : number
            /** Returns a normalized vector based on the current vector. The normalized vector has a magnitude of 1 and is in the same direction as the current vector. Returns a zero vector If the current vector is too small to be normalized.
            */
            public get normalized(): UnityEngine.Vector2;
            /** Returns the length of this vector (Read Only).
            */
            public get magnitude(): number;
            /** Returns the squared length of this vector (Read Only).
            */
            public get sqrMagnitude(): number;
            /** Shorthand for writing Vector2(0, 0).
            */
            public static get zero(): UnityEngine.Vector2;
            /** Shorthand for writing Vector2(1, 1).
            */
            public static get one(): UnityEngine.Vector2;
            /** Shorthand for writing Vector2(0, 1).
            */
            public static get up(): UnityEngine.Vector2;
            /** Shorthand for writing Vector2(0, -1).
            */
            public static get down(): UnityEngine.Vector2;
            /** Shorthand for writing Vector2(-1, 0).
            */
            public static get left(): UnityEngine.Vector2;
            /** Shorthand for writing Vector2(1, 0).
            */
            public static get right(): UnityEngine.Vector2;
            /** Shorthand for writing Vector2(float.PositiveInfinity, float.PositiveInfinity).
            */
            public static get positiveInfinity(): UnityEngine.Vector2;
            /** Shorthand for writing Vector2(float.NegativeInfinity, float.NegativeInfinity).
            */
            public static get negativeInfinity(): UnityEngine.Vector2;
            public get_Item ($index: number) : number
            public set_Item ($index: number, $value: number) : void
            /** Set x and y components of an existing Vector2.
            */
            public Set ($newX: number, $newY: number) : void
            /** Linearly interpolates between vectors a and b by t.
            */
            public static Lerp ($a: UnityEngine.Vector2, $b: UnityEngine.Vector2, $t: number) : UnityEngine.Vector2
            /** Linearly interpolates between vectors a and b by t.
            */
            public static LerpUnclamped ($a: UnityEngine.Vector2, $b: UnityEngine.Vector2, $t: number) : UnityEngine.Vector2
            /** Moves a point current towards target.
            */
            public static MoveTowards ($current: UnityEngine.Vector2, $target: UnityEngine.Vector2, $maxDistanceDelta: number) : UnityEngine.Vector2
            /** Multiplies two vectors component-wise.
            */
            public static Scale ($a: UnityEngine.Vector2, $b: UnityEngine.Vector2) : UnityEngine.Vector2
            /** Multiplies every component of this vector by the same component of scale.
            */
            public Scale ($scale: UnityEngine.Vector2) : void
            /** Makes this vector have a magnitude of 1.
            */
            public Normalize () : void
            /** Returns a formatted string for this vector.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString () : string
            /** Returns a formatted string for this vector.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string) : string
            /** Returns a formatted string for this vector.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string, $formatProvider: System.IFormatProvider) : string
            /** Returns true if the given vector is exactly equal to this vector.
            */
            public Equals ($other: any) : boolean
            public Equals ($other: UnityEngine.Vector2) : boolean
            /** Reflects a vector off the surface defined by a normal.
            * @param $inDirection The direction vector towards the surface.
            * @param $inNormal The normal vector that defines the surface.
            */
            public static Reflect ($inDirection: UnityEngine.Vector2, $inNormal: UnityEngine.Vector2) : UnityEngine.Vector2
            /** Returns the 2D vector perpendicular to this 2D vector. The result is always rotated 90-degrees in a counter-clockwise direction for a 2D coordinate system where the positive Y axis goes up.
            * @param $inDirection The input direction.
            * @returns The perpendicular direction. 
            */
            public static Perpendicular ($inDirection: UnityEngine.Vector2) : UnityEngine.Vector2
            /** Dot Product of two vectors.
            */
            public static Dot ($lhs: UnityEngine.Vector2, $rhs: UnityEngine.Vector2) : number
            /** Gets the unsigned angle in degrees between from and to.
            * @param $from The vector from which the angular difference is measured.
            * @param $to The vector to which the angular difference is measured.
            * @returns The unsigned angle in degrees between the two vectors. 
            */
            public static Angle ($from: UnityEngine.Vector2, $to: UnityEngine.Vector2) : number
            /** Gets the signed angle in degrees between from and to.
            * @param $from The vector from which the angular difference is measured.
            * @param $to The vector to which the angular difference is measured.
            * @returns The signed angle in degrees between the two vectors. 
            */
            public static SignedAngle ($from: UnityEngine.Vector2, $to: UnityEngine.Vector2) : number
            /** Returns the distance between a and b.
            */
            public static Distance ($a: UnityEngine.Vector2, $b: UnityEngine.Vector2) : number
            /** Returns a copy of vector with its magnitude clamped to maxLength.
            */
            public static ClampMagnitude ($vector: UnityEngine.Vector2, $maxLength: number) : UnityEngine.Vector2
            public static SqrMagnitude ($a: UnityEngine.Vector2) : number
            public SqrMagnitude () : number
            /** Returns a vector that is made from the smallest components of two vectors.
            */
            public static Min ($lhs: UnityEngine.Vector2, $rhs: UnityEngine.Vector2) : UnityEngine.Vector2
            /** Returns a vector that is made from the largest components of two vectors.
            */
            public static Max ($lhs: UnityEngine.Vector2, $rhs: UnityEngine.Vector2) : UnityEngine.Vector2
            /** Gradually changes a vector towards a desired goal over time.
            * @param $current The current position.
            * @param $target The position we are trying to reach.
            * @param $currentVelocity The current velocity, this value is modified by the function every time you call it.
            * @param $smoothTime Approximately the time it will take to reach the target. A smaller value will reach the target faster.
            * @param $maxSpeed Optionally allows you to clamp the maximum speed.
            * @param $deltaTime The time since the last call to this function. By default Time.deltaTime.
            */
            public static SmoothDamp ($current: UnityEngine.Vector2, $target: UnityEngine.Vector2, $currentVelocity: $Ref<UnityEngine.Vector2>, $smoothTime: number, $maxSpeed: number) : UnityEngine.Vector2
            /** Gradually changes a vector towards a desired goal over time.
            * @param $current The current position.
            * @param $target The position we are trying to reach.
            * @param $currentVelocity The current velocity, this value is modified by the function every time you call it.
            * @param $smoothTime Approximately the time it will take to reach the target. A smaller value will reach the target faster.
            * @param $maxSpeed Optionally allows you to clamp the maximum speed.
            * @param $deltaTime The time since the last call to this function. By default Time.deltaTime.
            */
            public static SmoothDamp ($current: UnityEngine.Vector2, $target: UnityEngine.Vector2, $currentVelocity: $Ref<UnityEngine.Vector2>, $smoothTime: number) : UnityEngine.Vector2
            /** Gradually changes a vector towards a desired goal over time.
            * @param $current The current position.
            * @param $target The position we are trying to reach.
            * @param $currentVelocity The current velocity, this value is modified by the function every time you call it.
            * @param $smoothTime Approximately the time it will take to reach the target. A smaller value will reach the target faster.
            * @param $maxSpeed Optionally allows you to clamp the maximum speed.
            * @param $deltaTime The time since the last call to this function. By default Time.deltaTime.
            */
            public static SmoothDamp ($current: UnityEngine.Vector2, $target: UnityEngine.Vector2, $currentVelocity: $Ref<UnityEngine.Vector2>, $smoothTime: number, $maxSpeed: number, $deltaTime: number) : UnityEngine.Vector2
            public static op_Addition ($a: UnityEngine.Vector2, $b: UnityEngine.Vector2) : UnityEngine.Vector2
            public static op_Subtraction ($a: UnityEngine.Vector2, $b: UnityEngine.Vector2) : UnityEngine.Vector2
            public static op_Multiply ($a: UnityEngine.Vector2, $b: UnityEngine.Vector2) : UnityEngine.Vector2
            public static op_Division ($a: UnityEngine.Vector2, $b: UnityEngine.Vector2) : UnityEngine.Vector2
            public static op_UnaryNegation ($a: UnityEngine.Vector2) : UnityEngine.Vector2
            public static op_Multiply ($a: UnityEngine.Vector2, $d: number) : UnityEngine.Vector2
            public static op_Multiply ($d: number, $a: UnityEngine.Vector2) : UnityEngine.Vector2
            public static op_Division ($a: UnityEngine.Vector2, $d: number) : UnityEngine.Vector2
            public static op_Equality ($lhs: UnityEngine.Vector2, $rhs: UnityEngine.Vector2) : boolean
            public static op_Inequality ($lhs: UnityEngine.Vector2, $rhs: UnityEngine.Vector2) : boolean
            public static op_Implicit ($v: UnityEngine.Vector3) : UnityEngine.Vector2
            public static op_Implicit ($v: UnityEngine.Vector2) : UnityEngine.Vector3
            public constructor ($x: number, $y: number)
        }
        /** Representation of 3D vectors and points.
        */
        class Vector3 extends System.ValueType implements System.IFormattable, System.IEquatable$1<UnityEngine.Vector3>
        {
            protected [__keep_incompatibility]: never;
            public static kEpsilon : number
            public static kEpsilonNormalSqrt : number
            /** X component of the vector.
            */
            public x : number
            /** Y component of the vector.
            */
            public y : number
            /** Z component of the vector.
            */
            public z : number
            /** Returns a normalized vector based on the current vector. The normalized vector has a magnitude of 1 and is in the same direction as the current vector. Returns a zero vector If the current vector is too small to be normalized.
            */
            public get normalized(): UnityEngine.Vector3;
            /** Returns the length of this vector (Read Only).
            */
            public get magnitude(): number;
            /** Returns the squared length of this vector (Read Only).
            */
            public get sqrMagnitude(): number;
            /** Shorthand for writing Vector3(0, 0, 0).
            */
            public static get zero(): UnityEngine.Vector3;
            /** Shorthand for writing Vector3(1, 1, 1).
            */
            public static get one(): UnityEngine.Vector3;
            /** Shorthand for writing Vector3(0, 0, 1).
            */
            public static get forward(): UnityEngine.Vector3;
            /** Shorthand for writing Vector3(0, 0, -1).
            */
            public static get back(): UnityEngine.Vector3;
            /** Shorthand for writing Vector3(0, 1, 0).
            */
            public static get up(): UnityEngine.Vector3;
            /** Shorthand for writing Vector3(0, -1, 0).
            */
            public static get down(): UnityEngine.Vector3;
            /** Shorthand for writing Vector3(-1, 0, 0).
            */
            public static get left(): UnityEngine.Vector3;
            /** Shorthand for writing Vector3(1, 0, 0).
            */
            public static get right(): UnityEngine.Vector3;
            /** Shorthand for writing Vector3(float.PositiveInfinity, float.PositiveInfinity, float.PositiveInfinity).
            */
            public static get positiveInfinity(): UnityEngine.Vector3;
            /** Shorthand for writing Vector3(float.NegativeInfinity, float.NegativeInfinity, float.NegativeInfinity).
            */
            public static get negativeInfinity(): UnityEngine.Vector3;
            /** Spherically interpolates between two vectors.
            */
            public static Slerp ($a: UnityEngine.Vector3, $b: UnityEngine.Vector3, $t: number) : UnityEngine.Vector3
            /** Spherically interpolates between two vectors.
            */
            public static SlerpUnclamped ($a: UnityEngine.Vector3, $b: UnityEngine.Vector3, $t: number) : UnityEngine.Vector3
            /** Makes vectors normalized and orthogonal to each other.
            */
            public static OrthoNormalize ($normal: $Ref<UnityEngine.Vector3>, $tangent: $Ref<UnityEngine.Vector3>) : void
            /** Makes vectors normalized and orthogonal to each other.
            */
            public static OrthoNormalize ($normal: $Ref<UnityEngine.Vector3>, $tangent: $Ref<UnityEngine.Vector3>, $binormal: $Ref<UnityEngine.Vector3>) : void
            /** Rotates a vector current towards target.
            * @param $current The vector being managed.
            * @param $target The vector.
            * @param $maxRadiansDelta The maximum angle in radians allowed for this rotation.
            * @param $maxMagnitudeDelta The maximum allowed change in vector magnitude for this rotation.
            * @returns The location that RotateTowards generates. 
            */
            public static RotateTowards ($current: UnityEngine.Vector3, $target: UnityEngine.Vector3, $maxRadiansDelta: number, $maxMagnitudeDelta: number) : UnityEngine.Vector3
            /** Linearly interpolates between two points.
            * @param $a Start value, returned when t = 0.
            * @param $b End value, returned when t = 1.
            * @param $t Value used to interpolate between a and b.
            * @returns Interpolated value, equals to a + (b - a) * t. 
            */
            public static Lerp ($a: UnityEngine.Vector3, $b: UnityEngine.Vector3, $t: number) : UnityEngine.Vector3
            /** Linearly interpolates between two vectors.
            */
            public static LerpUnclamped ($a: UnityEngine.Vector3, $b: UnityEngine.Vector3, $t: number) : UnityEngine.Vector3
            /** Calculate a position between the points specified by current and target, moving no farther than the distance specified by maxDistanceDelta.
            * @param $current The position to move from.
            * @param $target The position to move towards.
            * @param $maxDistanceDelta Distance to move current per call.
            * @returns The new position. 
            */
            public static MoveTowards ($current: UnityEngine.Vector3, $target: UnityEngine.Vector3, $maxDistanceDelta: number) : UnityEngine.Vector3
            /** Gradually changes a vector towards a desired goal over time.
            * @param $current The current position.
            * @param $target The position we are trying to reach.
            * @param $currentVelocity The current velocity, this value is modified by the function every time you call it.
            * @param $smoothTime Approximately the time it will take to reach the target. A smaller value will reach the target faster.
            * @param $maxSpeed Optionally allows you to clamp the maximum speed.
            * @param $deltaTime The time since the last call to this function. By default Time.deltaTime.
            */
            public static SmoothDamp ($current: UnityEngine.Vector3, $target: UnityEngine.Vector3, $currentVelocity: $Ref<UnityEngine.Vector3>, $smoothTime: number, $maxSpeed: number) : UnityEngine.Vector3
            /** Gradually changes a vector towards a desired goal over time.
            * @param $current The current position.
            * @param $target The position we are trying to reach.
            * @param $currentVelocity The current velocity, this value is modified by the function every time you call it.
            * @param $smoothTime Approximately the time it will take to reach the target. A smaller value will reach the target faster.
            * @param $maxSpeed Optionally allows you to clamp the maximum speed.
            * @param $deltaTime The time since the last call to this function. By default Time.deltaTime.
            */
            public static SmoothDamp ($current: UnityEngine.Vector3, $target: UnityEngine.Vector3, $currentVelocity: $Ref<UnityEngine.Vector3>, $smoothTime: number) : UnityEngine.Vector3
            /** Gradually changes a vector towards a desired goal over time.
            * @param $current The current position.
            * @param $target The position we are trying to reach.
            * @param $currentVelocity The current velocity, this value is modified by the function every time you call it.
            * @param $smoothTime Approximately the time it will take to reach the target. A smaller value will reach the target faster.
            * @param $maxSpeed Optionally allows you to clamp the maximum speed.
            * @param $deltaTime The time since the last call to this function. By default Time.deltaTime.
            */
            public static SmoothDamp ($current: UnityEngine.Vector3, $target: UnityEngine.Vector3, $currentVelocity: $Ref<UnityEngine.Vector3>, $smoothTime: number, $maxSpeed: number, $deltaTime: number) : UnityEngine.Vector3
            public get_Item ($index: number) : number
            public set_Item ($index: number, $value: number) : void
            /** Set x, y and z components of an existing Vector3.
            */
            public Set ($newX: number, $newY: number, $newZ: number) : void
            /** Multiplies two vectors component-wise.
            */
            public static Scale ($a: UnityEngine.Vector3, $b: UnityEngine.Vector3) : UnityEngine.Vector3
            /** Multiplies every component of this vector by the same component of scale.
            */
            public Scale ($scale: UnityEngine.Vector3) : void
            /** Cross Product of two vectors.
            */
            public static Cross ($lhs: UnityEngine.Vector3, $rhs: UnityEngine.Vector3) : UnityEngine.Vector3
            /** Returns true if the given vector is exactly equal to this vector.
            */
            public Equals ($other: any) : boolean
            public Equals ($other: UnityEngine.Vector3) : boolean
            /** Reflects a vector off the plane defined by a normal.
            * @param $inDirection The direction vector towards the plane.
            * @param $inNormal The normal vector that defines the plane.
            */
            public static Reflect ($inDirection: UnityEngine.Vector3, $inNormal: UnityEngine.Vector3) : UnityEngine.Vector3
            /** Returns a normalized vector based on the given vector. The normalized vector has a magnitude of 1 and is in the same direction as the given vector. Returns a zero vector If the given vector is too small to be normalized.
            * @param $value The vector to be normalized.
            * @returns A new vector with the same direction as the original vector but with a magnitude of 1.0. 
            */
            public static Normalize ($value: UnityEngine.Vector3) : UnityEngine.Vector3
            /** Makes this vector have a magnitude of 1.
            */
            public Normalize () : void
            /** Dot Product of two vectors.
            */
            public static Dot ($lhs: UnityEngine.Vector3, $rhs: UnityEngine.Vector3) : number
            /** Projects a vector onto another vector.
            */
            public static Project ($vector: UnityEngine.Vector3, $onNormal: UnityEngine.Vector3) : UnityEngine.Vector3
            /** Projects a vector onto a plane.
            * @param $vector The vector to project on the plane.
            * @param $planeNormal The normal which defines the plane to project on.
            * @returns The orthogonal projection of vector on the plane. 
            */
            public static ProjectOnPlane ($vector: UnityEngine.Vector3, $planeNormal: UnityEngine.Vector3) : UnityEngine.Vector3
            /** Calculates the angle between two vectors.
            * @param $from The vector from which the angular difference is measured.
            * @param $to The vector to which the angular difference is measured.
            * @returns The angle in degrees between the two vectors. 
            */
            public static Angle ($from: UnityEngine.Vector3, $to: UnityEngine.Vector3) : number
            /** Calculates the signed angle between vectors from and to in relation to axis.
            * @param $from The vector from which the angular difference is measured.
            * @param $to The vector to which the angular difference is measured.
            * @param $axis A vector around which the other vectors are rotated.
            * @returns Returns the signed angle between from and to in degrees. 
            */
            public static SignedAngle ($from: UnityEngine.Vector3, $to: UnityEngine.Vector3, $axis: UnityEngine.Vector3) : number
            /** Returns the distance between a and b.
            */
            public static Distance ($a: UnityEngine.Vector3, $b: UnityEngine.Vector3) : number
            /** Returns a copy of vector with its magnitude clamped to maxLength.
            */
            public static ClampMagnitude ($vector: UnityEngine.Vector3, $maxLength: number) : UnityEngine.Vector3
            public static Magnitude ($vector: UnityEngine.Vector3) : number
            public static SqrMagnitude ($vector: UnityEngine.Vector3) : number
            /** Returns a vector that is made from the smallest components of two vectors.
            */
            public static Min ($lhs: UnityEngine.Vector3, $rhs: UnityEngine.Vector3) : UnityEngine.Vector3
            /** Returns a vector that is made from the largest components of two vectors.
            */
            public static Max ($lhs: UnityEngine.Vector3, $rhs: UnityEngine.Vector3) : UnityEngine.Vector3
            public static op_Addition ($a: UnityEngine.Vector3, $b: UnityEngine.Vector3) : UnityEngine.Vector3
            public static op_Subtraction ($a: UnityEngine.Vector3, $b: UnityEngine.Vector3) : UnityEngine.Vector3
            public static op_UnaryNegation ($a: UnityEngine.Vector3) : UnityEngine.Vector3
            public static op_Multiply ($a: UnityEngine.Vector3, $d: number) : UnityEngine.Vector3
            public static op_Multiply ($d: number, $a: UnityEngine.Vector3) : UnityEngine.Vector3
            public static op_Division ($a: UnityEngine.Vector3, $d: number) : UnityEngine.Vector3
            public static op_Equality ($lhs: UnityEngine.Vector3, $rhs: UnityEngine.Vector3) : boolean
            public static op_Inequality ($lhs: UnityEngine.Vector3, $rhs: UnityEngine.Vector3) : boolean
            /** Returns a formatted string for this vector.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString () : string
            /** Returns a formatted string for this vector.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string) : string
            /** Returns a formatted string for this vector.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string, $formatProvider: System.IFormatProvider) : string
            public constructor ($x: number, $y: number, $z: number)
            public constructor ($x: number, $y: number)
        }
        /** Representation of four-dimensional vectors.
        */
        class Vector4 extends System.ValueType implements System.IFormattable, System.IEquatable$1<UnityEngine.Vector4>
        {
            protected [__keep_incompatibility]: never;
            public static kEpsilon : number
            /** X component of the vector.
            */
            public x : number
            /** Y component of the vector.
            */
            public y : number
            /** Z component of the vector.
            */
            public z : number
            /** W component of the vector.
            */
            public w : number
            /** Returns a normalized vector based on the current vector. The normalized vector has a magnitude of 1 and is in the same direction as the current vector. Returns a zero vector If the current vector is too small to be normalized.
            */
            public get normalized(): UnityEngine.Vector4;
            /** Returns the length of this vector (Read Only).
            */
            public get magnitude(): number;
            /** Returns the squared length of this vector (Read Only).
            */
            public get sqrMagnitude(): number;
            /** Shorthand for writing Vector4(0,0,0,0).
            */
            public static get zero(): UnityEngine.Vector4;
            /** Shorthand for writing Vector4(1,1,1,1).
            */
            public static get one(): UnityEngine.Vector4;
            /** Shorthand for writing Vector4(float.PositiveInfinity, float.PositiveInfinity, float.PositiveInfinity, float.PositiveInfinity).
            */
            public static get positiveInfinity(): UnityEngine.Vector4;
            /** Shorthand for writing Vector4(float.NegativeInfinity, float.NegativeInfinity, float.NegativeInfinity, float.NegativeInfinity).
            */
            public static get negativeInfinity(): UnityEngine.Vector4;
            public get_Item ($index: number) : number
            public set_Item ($index: number, $value: number) : void
            /** Set x, y, z and w components of an existing Vector4.
            */
            public Set ($newX: number, $newY: number, $newZ: number, $newW: number) : void
            /** Linearly interpolates between two vectors.
            */
            public static Lerp ($a: UnityEngine.Vector4, $b: UnityEngine.Vector4, $t: number) : UnityEngine.Vector4
            /** Linearly interpolates between two vectors.
            */
            public static LerpUnclamped ($a: UnityEngine.Vector4, $b: UnityEngine.Vector4, $t: number) : UnityEngine.Vector4
            /** Moves a point current towards target.
            */
            public static MoveTowards ($current: UnityEngine.Vector4, $target: UnityEngine.Vector4, $maxDistanceDelta: number) : UnityEngine.Vector4
            /** Multiplies two vectors component-wise.
            */
            public static Scale ($a: UnityEngine.Vector4, $b: UnityEngine.Vector4) : UnityEngine.Vector4
            /** Multiplies every component of this vector by the same component of scale.
            */
            public Scale ($scale: UnityEngine.Vector4) : void
            /** Returns true if the given vector is exactly equal to this vector.
            */
            public Equals ($other: any) : boolean
            public Equals ($other: UnityEngine.Vector4) : boolean
            /** Returns a normalized vector based on the given vector. The normalized vector has a magnitude of 1 and is in the same direction as the given vector. Returns a zero vector If the given vector is too small to be normalized.
            * @param $a The vector to be normalized.
            * @returns A new vector with the same direction as the original vector but with a magnitude of 1.0. 
            */
            public static Normalize ($a: UnityEngine.Vector4) : UnityEngine.Vector4
            /** Makes this vector have a magnitude of 1.
            */
            public Normalize () : void
            /** Dot Product of two vectors.
            */
            public static Dot ($a: UnityEngine.Vector4, $b: UnityEngine.Vector4) : number
            /** Projects a vector onto another vector.
            */
            public static Project ($a: UnityEngine.Vector4, $b: UnityEngine.Vector4) : UnityEngine.Vector4
            /** Returns the distance between a and b.
            */
            public static Distance ($a: UnityEngine.Vector4, $b: UnityEngine.Vector4) : number
            public static Magnitude ($a: UnityEngine.Vector4) : number
            /** Returns a vector that is made from the smallest components of two vectors.
            */
            public static Min ($lhs: UnityEngine.Vector4, $rhs: UnityEngine.Vector4) : UnityEngine.Vector4
            /** Returns a vector that is made from the largest components of two vectors.
            */
            public static Max ($lhs: UnityEngine.Vector4, $rhs: UnityEngine.Vector4) : UnityEngine.Vector4
            public static op_Addition ($a: UnityEngine.Vector4, $b: UnityEngine.Vector4) : UnityEngine.Vector4
            public static op_Subtraction ($a: UnityEngine.Vector4, $b: UnityEngine.Vector4) : UnityEngine.Vector4
            public static op_UnaryNegation ($a: UnityEngine.Vector4) : UnityEngine.Vector4
            public static op_Multiply ($a: UnityEngine.Vector4, $d: number) : UnityEngine.Vector4
            public static op_Multiply ($d: number, $a: UnityEngine.Vector4) : UnityEngine.Vector4
            public static op_Division ($a: UnityEngine.Vector4, $d: number) : UnityEngine.Vector4
            public static op_Equality ($lhs: UnityEngine.Vector4, $rhs: UnityEngine.Vector4) : boolean
            public static op_Inequality ($lhs: UnityEngine.Vector4, $rhs: UnityEngine.Vector4) : boolean
            public static op_Implicit ($v: UnityEngine.Vector3) : UnityEngine.Vector4
            public static op_Implicit ($v: UnityEngine.Vector4) : UnityEngine.Vector3
            public static op_Implicit ($v: UnityEngine.Vector2) : UnityEngine.Vector4
            public static op_Implicit ($v: UnityEngine.Vector4) : UnityEngine.Vector2
            /** Returns a formatted string for this vector.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString () : string
            /** Returns a formatted string for this vector.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string) : string
            /** Returns a formatted string for this vector.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string, $formatProvider: System.IFormatProvider) : string
            public static SqrMagnitude ($a: UnityEngine.Vector4) : number
            public SqrMagnitude () : number
            public constructor ($x: number, $y: number, $z: number, $w: number)
            public constructor ($x: number, $y: number, $z: number)
            public constructor ($x: number, $y: number)
        }
        /** Quaternions are used to represent rotations.
        */
        class Quaternion extends System.ValueType implements System.IFormattable, System.IEquatable$1<UnityEngine.Quaternion>
        {
            protected [__keep_incompatibility]: never;
            /** X component of the Quaternion. Don't modify this directly unless you know quaternions inside out.
            */
            public x : number
            /** Y component of the Quaternion. Don't modify this directly unless you know quaternions inside out.
            */
            public y : number
            /** Z component of the Quaternion. Don't modify this directly unless you know quaternions inside out.
            */
            public z : number
            /** W component of the Quaternion. Do not directly modify quaternions.
            */
            public w : number
            public static kEpsilon : number
            /** The identity rotation (Read Only).
            */
            public static get identity(): UnityEngine.Quaternion;
            /** Returns or sets the euler angle representation of the rotation in degrees.
            */
            public get eulerAngles(): UnityEngine.Vector3;
            public set eulerAngles(value: UnityEngine.Vector3);
            /** Returns this quaternion with a magnitude of 1 (Read Only).
            */
            public get normalized(): UnityEngine.Quaternion;
            /** Creates a rotation from fromDirection to toDirection.
            * @param $fromDirection A non-unit or unit vector representing a direction axis to rotate.
            * @param $toDirection A non-unit or unit vector representing the target direction axis.
            * @returns A unit quaternion which rotates from fromDirection to toDirection. 
            */
            public static FromToRotation ($fromDirection: UnityEngine.Vector3, $toDirection: UnityEngine.Vector3) : UnityEngine.Quaternion
            /** Returns the Inverse of rotation.
            */
            public static Inverse ($rotation: UnityEngine.Quaternion) : UnityEngine.Quaternion
            /** Spherically linear interpolates between unit quaternions a and b by a ratio of t.
            * @param $a Start unit quaternion value, returned when t = 0.
            * @param $b End unit quaternion value, returned when t = 1.
            * @param $t Interpolation ratio. Value is clamped to the range [0, 1].
            * @returns A unit quaternion spherically interpolated between quaternions a and b. 
            */
            public static Slerp ($a: UnityEngine.Quaternion, $b: UnityEngine.Quaternion, $t: number) : UnityEngine.Quaternion
            /** Spherically linear interpolates between unit quaternions a and b by t.
            * @param $a Start unit quaternion value, returned when t = 0.
            * @param $b End unit quaternion value, returned when t = 1.
            * @param $t Interpolation ratio. Value is unclamped.
            * @returns A unit quaternion spherically interpolated between unit quaternions a and b. 
            */
            public static SlerpUnclamped ($a: UnityEngine.Quaternion, $b: UnityEngine.Quaternion, $t: number) : UnityEngine.Quaternion
            /** Interpolates between a and b by t and normalizes the result afterwards.
            * @param $a Start unit quaternion value, returned when t = 0.
            * @param $b End unit quaternion value, returned when t = 1.
            * @param $t Interpolation ratio. The value is clamped to the range [0, 1].
            * @returns A unit quaternion interpolated between quaternions a and b. 
            */
            public static Lerp ($a: UnityEngine.Quaternion, $b: UnityEngine.Quaternion, $t: number) : UnityEngine.Quaternion
            /** Interpolates between a and b by t and normalizes the result afterwards. The parameter t is not clamped.
            */
            public static LerpUnclamped ($a: UnityEngine.Quaternion, $b: UnityEngine.Quaternion, $t: number) : UnityEngine.Quaternion
            /** Creates a rotation which rotates angle degrees around axis.
            */
            public static AngleAxis ($angle: number, $axis: UnityEngine.Vector3) : UnityEngine.Quaternion
            /** Creates a rotation with the specified forward and upwards directions.
            * @param $forward The direction to look in.
            * @param $upwards The vector that defines in which direction up is.
            */
            public static LookRotation ($forward: UnityEngine.Vector3, $upwards: UnityEngine.Vector3) : UnityEngine.Quaternion
            /** Creates a rotation with the specified forward and upwards directions.
            * @param $forward The direction to look in.
            * @param $upwards The vector that defines in which direction up is.
            */
            public static LookRotation ($forward: UnityEngine.Vector3) : UnityEngine.Quaternion
            public get_Item ($index: number) : number
            public set_Item ($index: number, $value: number) : void
            /** Set x, y, z and w components of an existing Quaternion.
            */
            public Set ($newX: number, $newY: number, $newZ: number, $newW: number) : void
            public static op_Multiply ($lhs: UnityEngine.Quaternion, $rhs: UnityEngine.Quaternion) : UnityEngine.Quaternion
            public static op_Multiply ($rotation: UnityEngine.Quaternion, $point: UnityEngine.Vector3) : UnityEngine.Vector3
            public static op_Equality ($lhs: UnityEngine.Quaternion, $rhs: UnityEngine.Quaternion) : boolean
            public static op_Inequality ($lhs: UnityEngine.Quaternion, $rhs: UnityEngine.Quaternion) : boolean
            /** The dot product between two rotations.
            */
            public static Dot ($a: UnityEngine.Quaternion, $b: UnityEngine.Quaternion) : number
            /** Creates a rotation with the specified forward and upwards directions.
            * @param $view The direction to look in.
            * @param $up The vector that defines in which direction up is.
            */
            public SetLookRotation ($view: UnityEngine.Vector3) : void
            /** Creates a rotation with the specified forward and upwards directions.
            * @param $view The direction to look in.
            * @param $up The vector that defines in which direction up is.
            */
            public SetLookRotation ($view: UnityEngine.Vector3, $up: UnityEngine.Vector3) : void
            /** Returns the angle in degrees between two rotations a and b. The resulting angle ranges from 0 to 180.
            */
            public static Angle ($a: UnityEngine.Quaternion, $b: UnityEngine.Quaternion) : number
            /** Returns a rotation that rotates z degrees around the z axis, x degrees around the x axis, and y degrees around the y axis; applied in that order.
            */
            public static Euler ($x: number, $y: number, $z: number) : UnityEngine.Quaternion
            /** Returns a rotation that rotates z degrees around the z axis, x degrees around the x axis, and y degrees around the y axis.
            */
            public static Euler ($euler: UnityEngine.Vector3) : UnityEngine.Quaternion
            /** Converts a rotation to angle-axis representation (angles in degrees).
            */
            public ToAngleAxis ($angle: $Ref<number>, $axis: $Ref<UnityEngine.Vector3>) : void
            /** Creates a rotation which rotates from fromDirection to toDirection.
            */
            public SetFromToRotation ($fromDirection: UnityEngine.Vector3, $toDirection: UnityEngine.Vector3) : void
            /** Rotates a rotation from towards to.
            * @param $from The unit quaternion to be aligned with to.
            * @param $to The target unit quaternion.
            * @param $maxDegreesDelta The maximum angle in degrees allowed for this rotation.
            * @returns A unit quaternion rotated towards to by an angular step of maxDegreesDelta. 
            */
            public static RotateTowards ($from: UnityEngine.Quaternion, $to: UnityEngine.Quaternion, $maxDegreesDelta: number) : UnityEngine.Quaternion
            /** Converts this quaternion to a quaternion with the same orientation but with a magnitude of 1.0.
            */
            public static Normalize ($q: UnityEngine.Quaternion) : UnityEngine.Quaternion
            public Normalize () : void
            public Equals ($other: any) : boolean
            public Equals ($other: UnityEngine.Quaternion) : boolean
            /** Returns a formatted string for this quaternion.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString () : string
            /** Returns a formatted string for this quaternion.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string) : string
            /** Returns a formatted string for this quaternion.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string, $formatProvider: System.IFormatProvider) : string
            public constructor ($x: number, $y: number, $z: number, $w: number)
        }
        /** Representation of RGBA colors.
        */
        class Color extends System.ValueType implements System.IFormattable, System.IEquatable$1<UnityEngine.Color>
        {
            protected [__keep_incompatibility]: never;
            /** Red component of the color.
            */
            public r : number
            /** Green component of the color.
            */
            public g : number
            /** Blue component of the color.
            */
            public b : number
            /** Alpha component of the color (0 is transparent, 1 is opaque).
            */
            public a : number
            /** Solid red. RGBA is (1, 0, 0, 1).
            */
            public static get red(): UnityEngine.Color;
            /** Solid green. RGBA is (0, 1, 0, 1).
            */
            public static get green(): UnityEngine.Color;
            /** Solid blue. RGBA is (0, 0, 1, 1).
            */
            public static get blue(): UnityEngine.Color;
            /** Solid white. RGBA is (1, 1, 1, 1).
            */
            public static get white(): UnityEngine.Color;
            /** Solid black. RGBA is (0, 0, 0, 1).
            */
            public static get black(): UnityEngine.Color;
            /** Yellow. RGBA is (1, 0.92, 0.016, 1), but the color is nice to look at!
            */
            public static get yellow(): UnityEngine.Color;
            /** Cyan. RGBA is (0, 1, 1, 1).
            */
            public static get cyan(): UnityEngine.Color;
            /** Magenta. RGBA is (1, 0, 1, 1).
            */
            public static get magenta(): UnityEngine.Color;
            /** Gray. RGBA is (0.5, 0.5, 0.5, 1).
            */
            public static get gray(): UnityEngine.Color;
            /** English spelling for gray. RGBA is the same (0.5, 0.5, 0.5, 1).
            */
            public static get grey(): UnityEngine.Color;
            /** Completely transparent. RGBA is (0, 0, 0, 0).
            */
            public static get clear(): UnityEngine.Color;
            /** The grayscale value of the color. (Read Only)
            */
            public get grayscale(): number;
            /** A linear value of an sRGB color.
            */
            public get linear(): UnityEngine.Color;
            /** A version of the color that has had the gamma curve applied.
            */
            public get gamma(): UnityEngine.Color;
            /** Returns the maximum color component value: Max(r,g,b).
            */
            public get maxColorComponent(): number;
            /** Returns a formatted string of this color.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString () : string
            /** Returns a formatted string of this color.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string) : string
            /** Returns a formatted string of this color.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string, $formatProvider: System.IFormatProvider) : string
            public Equals ($other: any) : boolean
            public Equals ($other: UnityEngine.Color) : boolean
            public static op_Addition ($a: UnityEngine.Color, $b: UnityEngine.Color) : UnityEngine.Color
            public static op_Subtraction ($a: UnityEngine.Color, $b: UnityEngine.Color) : UnityEngine.Color
            public static op_Multiply ($a: UnityEngine.Color, $b: UnityEngine.Color) : UnityEngine.Color
            public static op_Multiply ($a: UnityEngine.Color, $b: number) : UnityEngine.Color
            public static op_Multiply ($b: number, $a: UnityEngine.Color) : UnityEngine.Color
            public static op_Division ($a: UnityEngine.Color, $b: number) : UnityEngine.Color
            public static op_Equality ($lhs: UnityEngine.Color, $rhs: UnityEngine.Color) : boolean
            public static op_Inequality ($lhs: UnityEngine.Color, $rhs: UnityEngine.Color) : boolean
            /** Linearly interpolates between colors a and b by t.
            * @param $a Color a.
            * @param $b Color b.
            * @param $t Float for combining a and b.
            */
            public static Lerp ($a: UnityEngine.Color, $b: UnityEngine.Color, $t: number) : UnityEngine.Color
            /** Linearly interpolates between colors a and b by t.
            */
            public static LerpUnclamped ($a: UnityEngine.Color, $b: UnityEngine.Color, $t: number) : UnityEngine.Color
            public static op_Implicit ($c: UnityEngine.Color) : UnityEngine.Vector4
            public static op_Implicit ($v: UnityEngine.Vector4) : UnityEngine.Color
            public get_Item ($index: number) : number
            public set_Item ($index: number, $value: number) : void
            /** Calculates the hue, saturation and value of an RGB input color.
            * @param $rgbColor An input color.
            * @param $H Output variable for hue.
            * @param $S Output variable for saturation.
            * @param $V Output variable for value.
            */
            public static RGBToHSV ($rgbColor: UnityEngine.Color, $H: $Ref<number>, $S: $Ref<number>, $V: $Ref<number>) : void
            /** Creates an RGB colour from HSV input.
            * @param $H Hue [0..1].
            * @param $S Saturation [0..1].
            * @param $V Brightness value [0..1].
            * @param $hdr Output HDR colours. If true, the returned colour will not be clamped to [0..1].
            * @returns An opaque colour with HSV matching the input. 
            */
            public static HSVToRGB ($H: number, $S: number, $V: number) : UnityEngine.Color
            /** Creates an RGB colour from HSV input.
            * @param $H Hue [0..1].
            * @param $S Saturation [0..1].
            * @param $V Brightness value [0..1].
            * @param $hdr Output HDR colours. If true, the returned colour will not be clamped to [0..1].
            * @returns An opaque colour with HSV matching the input. 
            */
            public static HSVToRGB ($H: number, $S: number, $V: number, $hdr: boolean) : UnityEngine.Color
            public constructor ($r: number, $g: number, $b: number, $a: number)
            public constructor ($r: number, $g: number, $b: number)
        }
        /** Base class for all objects Unity can reference.
        */
        class Object extends System.Object
        {
            protected [__keep_incompatibility]: never;
            /** The name of the object.
            */
            public get name(): string;
            public set name(value: string);
            /** Should the object be hidden, saved with the Scene or modifiable by the user?
            */
            public get hideFlags(): UnityEngine.HideFlags;
            public set hideFlags(value: UnityEngine.HideFlags);
            /** Gets  the instance ID of the object.
            * @returns Returns the instance ID of the object. 
            */
            public GetInstanceID () : number
            public static op_Implicit ($exists: UnityEngine.Object) : boolean
            public static InstantiateAsync ($original: UnityEngine.Object) : UnityEngine.AsyncInstantiateOperation$1<UnityEngine.Object>
            public static InstantiateAsync ($original: UnityEngine.Object, $parent: UnityEngine.Transform) : UnityEngine.AsyncInstantiateOperation$1<UnityEngine.Object>
            public static InstantiateAsync ($original: UnityEngine.Object, $position: UnityEngine.Vector3, $rotation: UnityEngine.Quaternion) : UnityEngine.AsyncInstantiateOperation$1<UnityEngine.Object>
            public static InstantiateAsync ($original: UnityEngine.Object, $parent: UnityEngine.Transform, $position: UnityEngine.Vector3, $rotation: UnityEngine.Quaternion) : UnityEngine.AsyncInstantiateOperation$1<UnityEngine.Object>
            public static InstantiateAsync ($original: UnityEngine.Object, $count: number) : UnityEngine.AsyncInstantiateOperation$1<UnityEngine.Object>
            public static InstantiateAsync ($original: UnityEngine.Object, $count: number, $parent: UnityEngine.Transform) : UnityEngine.AsyncInstantiateOperation$1<UnityEngine.Object>
            public static InstantiateAsync ($original: UnityEngine.Object, $count: number, $position: UnityEngine.Vector3, $rotation: UnityEngine.Quaternion) : UnityEngine.AsyncInstantiateOperation$1<UnityEngine.Object>
            public static InstantiateAsync ($original: UnityEngine.Object, $count: number, $parent: UnityEngine.Transform, $position: UnityEngine.Vector3, $rotation: UnityEngine.Quaternion) : UnityEngine.AsyncInstantiateOperation$1<UnityEngine.Object>
            public static InstantiateAsync ($original: UnityEngine.Object, $count: number, $parent: UnityEngine.Transform, $position: UnityEngine.Vector3, $rotation: UnityEngine.Quaternion, $cancellationToken: System.Threading.CancellationToken) : UnityEngine.AsyncInstantiateOperation$1<UnityEngine.Object>
            public static InstantiateAsync ($original: UnityEngine.Object, $parameters: UnityEngine.InstantiateParameters, $cancellationToken?: System.Threading.CancellationToken) : UnityEngine.AsyncInstantiateOperation$1<UnityEngine.Object>
            public static InstantiateAsync ($original: UnityEngine.Object, $count: number, $parameters: UnityEngine.InstantiateParameters, $cancellationToken?: System.Threading.CancellationToken) : UnityEngine.AsyncInstantiateOperation$1<UnityEngine.Object>
            public static InstantiateAsync ($original: UnityEngine.Object, $position: UnityEngine.Vector3, $rotation: UnityEngine.Quaternion, $parameters: UnityEngine.InstantiateParameters, $cancellationToken?: System.Threading.CancellationToken) : UnityEngine.AsyncInstantiateOperation$1<UnityEngine.Object>
            public static InstantiateAsync ($original: UnityEngine.Object, $count: number, $position: UnityEngine.Vector3, $rotation: UnityEngine.Quaternion, $parameters: UnityEngine.InstantiateParameters, $cancellationToken?: System.Threading.CancellationToken) : UnityEngine.AsyncInstantiateOperation$1<UnityEngine.Object>
            /** Clones the object original and returns the clone.
            * @param $original An existing object that you want to make a copy of.
            * @param $position Position for the new object.
            * @param $rotation Orientation of the new object.
            * @param $parent Parent that will be assigned to the new object.
            * @param $instantiateInWorldSpace When you assign a parent Object, pass true to position the new object directly in world space. Pass false to set the Object’s position relative to its new parent.
            * @param $parameters A struct containing all the parameters.
            * @returns The instantiated clone. 
            */
            public static Instantiate ($original: UnityEngine.Object, $position: UnityEngine.Vector3, $rotation: UnityEngine.Quaternion) : UnityEngine.Object
            /** Clones the object original and returns the clone.
            * @param $original An existing object that you want to make a copy of.
            * @param $position Position for the new object.
            * @param $rotation Orientation of the new object.
            * @param $parent Parent that will be assigned to the new object.
            * @param $instantiateInWorldSpace When you assign a parent Object, pass true to position the new object directly in world space. Pass false to set the Object’s position relative to its new parent.
            * @param $parameters A struct containing all the parameters.
            * @returns The instantiated clone. 
            */
            public static Instantiate ($original: UnityEngine.Object, $position: UnityEngine.Vector3, $rotation: UnityEngine.Quaternion, $parent: UnityEngine.Transform) : UnityEngine.Object
            /** Clones the object original and returns the clone.
            * @param $original An existing object that you want to make a copy of.
            * @param $position Position for the new object.
            * @param $rotation Orientation of the new object.
            * @param $parent Parent that will be assigned to the new object.
            * @param $instantiateInWorldSpace When you assign a parent Object, pass true to position the new object directly in world space. Pass false to set the Object’s position relative to its new parent.
            * @param $parameters A struct containing all the parameters.
            * @returns The instantiated clone. 
            */
            public static Instantiate ($original: UnityEngine.Object) : UnityEngine.Object
            /** Clones the object original and returns the clone.
            * @param $original An existing object that you want to make a copy of.
            * @param $position Position for the new object.
            * @param $rotation Orientation of the new object.
            * @param $parent Parent that will be assigned to the new object.
            * @param $instantiateInWorldSpace When you assign a parent Object, pass true to position the new object directly in world space. Pass false to set the Object’s position relative to its new parent.
            * @param $parameters A struct containing all the parameters.
            * @returns The instantiated clone. 
            */
            public static Instantiate ($original: UnityEngine.Object, $scene: UnityEngine.SceneManagement.Scene) : UnityEngine.Object
            public static Instantiate ($original: UnityEngine.Object, $parameters: UnityEngine.InstantiateParameters) : UnityEngine.Object
            public static Instantiate ($original: UnityEngine.Object, $position: UnityEngine.Vector3, $rotation: UnityEngine.Quaternion, $parameters: UnityEngine.InstantiateParameters) : UnityEngine.Object
            /** Clones the object original and returns the clone.
            * @param $original An existing object that you want to make a copy of.
            * @param $position Position for the new object.
            * @param $rotation Orientation of the new object.
            * @param $parent Parent that will be assigned to the new object.
            * @param $instantiateInWorldSpace When you assign a parent Object, pass true to position the new object directly in world space. Pass false to set the Object’s position relative to its new parent.
            * @param $parameters A struct containing all the parameters.
            * @returns The instantiated clone. 
            */
            public static Instantiate ($original: UnityEngine.Object, $parent: UnityEngine.Transform) : UnityEngine.Object
            /** Clones the object original and returns the clone.
            * @param $original An existing object that you want to make a copy of.
            * @param $position Position for the new object.
            * @param $rotation Orientation of the new object.
            * @param $parent Parent that will be assigned to the new object.
            * @param $instantiateInWorldSpace When you assign a parent Object, pass true to position the new object directly in world space. Pass false to set the Object’s position relative to its new parent.
            * @param $parameters A struct containing all the parameters.
            * @returns The instantiated clone. 
            */
            public static Instantiate ($original: UnityEngine.Object, $parent: UnityEngine.Transform, $instantiateInWorldSpace: boolean) : UnityEngine.Object
            public static Instantiate ($original: UnityEngine.Object, $parent: UnityEngine.Transform, $worldPositionStays: boolean) : UnityEngine.Object
            /** Removes a GameObject, component or asset.
            * @param $obj The object to destroy.
            * @param $t The optional amount of time to delay before destroying the object.
            */
            public static Destroy ($obj: UnityEngine.Object, $t: number) : void
            /** Removes a GameObject, component or asset.
            * @param $obj The object to destroy.
            * @param $t The optional amount of time to delay before destroying the object.
            */
            public static Destroy ($obj: UnityEngine.Object) : void
            /** Destroys the object obj immediately. You are strongly recommended to use Destroy instead.
            * @param $obj Object to be destroyed.
            * @param $allowDestroyingAssets Set to true to allow assets to be destroyed.
            */
            public static DestroyImmediate ($obj: UnityEngine.Object, $allowDestroyingAssets: boolean) : void
            /** Destroys the object obj immediately. You are strongly recommended to use Destroy instead.
            * @param $obj Object to be destroyed.
            * @param $allowDestroyingAssets Set to true to allow assets to be destroyed.
            */
            public static DestroyImmediate ($obj: UnityEngine.Object) : void
            /** Retrieves a list of all loaded objects of Type type.
            * @param $type The type of object to find.
            * @param $findObjectsInactive Whether to include components attached to inactive GameObjects. If you don't specify this parameter, this function doesn't include inactive objects in the results.
            * @param $sortMode Whether and how to sort the returned array. Not sorting the array makes this function run significantly faster.
            * @returns The array of objects found matching the type specified. 
            */
            public static FindObjectsByType ($type: System.Type, $sortMode: UnityEngine.FindObjectsSortMode) : System.Array$1<UnityEngine.Object>
            /** Retrieves a list of all loaded objects of Type type.
            * @param $type The type of object to find.
            * @param $findObjectsInactive Whether to include components attached to inactive GameObjects. If you don't specify this parameter, this function doesn't include inactive objects in the results.
            * @param $sortMode Whether and how to sort the returned array. Not sorting the array makes this function run significantly faster.
            * @returns The array of objects found matching the type specified. 
            */
            public static FindObjectsByType ($type: System.Type, $findObjectsInactive: UnityEngine.FindObjectsInactive, $sortMode: UnityEngine.FindObjectsSortMode) : System.Array$1<UnityEngine.Object>
            /** Do not destroy the target Object when loading a new Scene.
            * @param $target An Object not destroyed on Scene change.
            */
            public static DontDestroyOnLoad ($target: UnityEngine.Object) : void
            /** Retrieves the first active loaded object of Type type.
            * @param $type The type of object to find.
            * @param $findObjectsInactive Whether to include components attached to inactive GameObjects. If you don't specify this parameter, this function doesn't include inactive objects in the results.
            * @returns Returns the first active loaded object that matches the specified type. If no object matches the specified type, returns null. 
            */
            public static FindFirstObjectByType ($type: System.Type) : UnityEngine.Object
            /** Retrieves any active loaded object of Type type.
            * @param $type The type of object to find.
            * @param $findObjectsInactive Whether to include components attached to inactive GameObjects. If you don't specify this parameter, this function doesn't include inactive objects in the results.
            * @returns Returns an arbitrary active loaded object that matches the specified type. If no object matches the specified type, returns null. 
            */
            public static FindAnyObjectByType ($type: System.Type) : UnityEngine.Object
            /** Retrieves the first active loaded object of Type type.
            * @param $type The type of object to find.
            * @param $findObjectsInactive Whether to include components attached to inactive GameObjects. If you don't specify this parameter, this function doesn't include inactive objects in the results.
            * @returns Returns the first active loaded object that matches the specified type. If no object matches the specified type, returns null. 
            */
            public static FindFirstObjectByType ($type: System.Type, $findObjectsInactive: UnityEngine.FindObjectsInactive) : UnityEngine.Object
            /** Retrieves any active loaded object of Type type.
            * @param $type The type of object to find.
            * @param $findObjectsInactive Whether to include components attached to inactive GameObjects. If you don't specify this parameter, this function doesn't include inactive objects in the results.
            * @returns Returns an arbitrary active loaded object that matches the specified type. If no object matches the specified type, returns null. 
            */
            public static FindAnyObjectByType ($type: System.Type, $findObjectsInactive: UnityEngine.FindObjectsInactive) : UnityEngine.Object
            public static op_Equality ($x: UnityEngine.Object, $y: UnityEngine.Object) : boolean
            public static op_Inequality ($x: UnityEngine.Object, $y: UnityEngine.Object) : boolean
            public constructor ()
        }
        /** Base class for all objects that can exist in a scene. Add components to a GameObject to control its appearance and behavior.
        */
        class GameObject extends UnityEngine.Object
        {
            protected [__keep_incompatibility]: never;
            /** The Transform attached to the GameObject (Read Only).
            */
            public get transform(): UnityEngine.Transform;
            /** Integer identifying the layer the GameObject is assigned to.
            */
            public get layer(): number;
            public set layer(value: number);
            /** The local active state of the GameObject. True if active, false if inactive. (Read Only)
            */
            public get activeSelf(): boolean;
            /** The active state of the GameObject in the Scene hierarchy. True if active, false if inactive. (Read Only)
            */
            public get activeInHierarchy(): boolean;
            /** Whether there are any Static Editor Flags set for the GameObject.
            */
            public get isStatic(): boolean;
            public set isStatic(value: boolean);
            /** The tag assigned to the GameObject.
            */
            public get tag(): string;
            public set tag(value: string);
            /** The Scene that contains the GameObject.
            */
            public get scene(): UnityEngine.SceneManagement.Scene;
            /** The Scene culling mask defined for the GameObject. (Read Only)
            */
            public get sceneCullingMask(): bigint;
            public get gameObject(): UnityEngine.GameObject;
            /** Creates a GameObject of the specified PrimtiveType with a mesh renderer and appropriate collider.
            * @param $type The type of primitive object to create, specified as a member of the PrimitiveType enum.
            */
            public static CreatePrimitive ($type: UnityEngine.PrimitiveType) : UnityEngine.GameObject
            /** Retrieves a reference to a component of specified type, by providing the component type as a method parameter.
            * @param $type The type of component to search for, specified as a Type object.
            * @returns A reference to a component of the specified type, returned as a Component type. If no component is found, returns null. 
            */
            public GetComponent ($type: System.Type) : UnityEngine.Component
            /** Retrieves a reference to a component of the specified type, by providing the name of the component type as a method parameter.
            * @param $type The name of the type of component to search for, specified as a string.
            * @returns A reference to a component of the specified type, returned as a Component type. If no component is found, returns null. 
            */
            public GetComponent ($type: string) : UnityEngine.Component
            /** This is the non-generic version of this method.
            * @param $type The type of Component to retrieve.
            * @param $includeInactive Whether to include inactive child GameObjects in the search.
            * @returns A component of the matching type, if found. 
            */
            public GetComponentInChildren ($type: System.Type, $includeInactive: boolean) : UnityEngine.Component
            /** This is the non-generic version of this method.
            * @param $type The type of Component to retrieve.
            * @param $includeInactive Whether to include inactive child GameObjects in the search.
            * @returns A component of the matching type, if found. 
            */
            public GetComponentInChildren ($type: System.Type) : UnityEngine.Component
            /** The non-generic version of this method.
            * @param $type The type of component to search for.
            * @param $includeInactive Whether to include inactive parent GameObjects in the search.
            * @returns A Component of the matching type, otherwise null if no matching Component is found. 
            */
            public GetComponentInParent ($type: System.Type, $includeInactive: boolean) : UnityEngine.Component
            /** The non-generic version of this method.
            * @param $type The type of component to search for.
            * @param $includeInactive Whether to include inactive parent GameObjects in the search.
            * @returns A Component of the matching type, otherwise null if no matching Component is found. 
            */
            public GetComponentInParent ($type: System.Type) : UnityEngine.Component
            /** The non-generic version of this method.
            * @param $type The type of component to search for.
            * @returns An array containing all matching components of type type. 
            */
            public GetComponents ($type: System.Type) : System.Array$1<UnityEngine.Component>
            public GetComponents ($type: System.Type, $results: System.Collections.Generic.List$1<UnityEngine.Component>) : void
            /** The non-generic version of this method.
            * @param $type The type of component to search for.
            * @param $includeInactive Whether to include inactive child GameObjects in the search.
            * @returns An array of all found components matching the specified type. 
            */
            public GetComponentsInChildren ($type: System.Type) : System.Array$1<UnityEngine.Component>
            /** The non-generic version of this method.
            * @param $type The type of component to search for.
            * @param $includeInactive Whether to include inactive child GameObjects in the search.
            * @returns An array of all found components matching the specified type. 
            */
            public GetComponentsInChildren ($type: System.Type, $includeInactive: boolean) : System.Array$1<UnityEngine.Component>
            public GetComponentsInParent ($type: System.Type) : System.Array$1<UnityEngine.Component>
            /** The non-generic version of this method.
            * @param $type The type of component to search for.
            * @param $includeInactive Whether to include inactive parent GameObjects in the search.
            * @returns An array of all found components matching the specified type. 
            */
            public GetComponentsInParent ($type: System.Type, $includeInactive: boolean) : System.Array$1<UnityEngine.Component>
            /** The non-generic version of this method.
            * @param $type The type of component to search for.
            * @param $component The out parameter that will contain the component or null.
            * @returns Returns true if the component is found, false otherwise. 
            */
            public TryGetComponent ($type: System.Type, $component: $Ref<UnityEngine.Component>) : boolean
            /** Retrieves the first active GameObject tagged with the specified tag. Returns null if no GameObject has the tag.
            * @param $tag The tag to search for.
            */
            public static FindWithTag ($tag: string) : UnityEngine.GameObject
            public static FindGameObjectsWithTag ($tag: string, $results: System.Collections.Generic.List$1<UnityEngine.GameObject>) : void
            public SendMessageUpwards ($methodName: string, $options: UnityEngine.SendMessageOptions) : void
            public SendMessage ($methodName: string, $options: UnityEngine.SendMessageOptions) : void
            public BroadcastMessage ($methodName: string, $options: UnityEngine.SendMessageOptions) : void
            /** Adds a component of the specified type to the GameObject.
            */
            public AddComponent ($componentType: System.Type) : UnityEngine.Component
            /** Retrieves the total number of components currently attached to the GameObject.
            * @returns The number of components on the GameObject as an Integer value. 
            */
            public GetComponentCount () : number
            /** Retrieves a reference to a component of type T at a specific index on the specified GameObject.
            * @param $index The index position in the array of components at which to find the requested object.
            * @returns A reference to a component of type T at the specified index. If no component is found at the specified index, returns null. 
            */
            public GetComponentAtIndex ($index: number) : UnityEngine.Component
            /** Retrieves the index of the specified component in the array of components attached to the GameObject.
            * @param $component The component to search for.
            * @returns The index of the specified Component if it exists. Otherwise, returns -1. 
            */
            public GetComponentIndex ($component: UnityEngine.Component) : number
            /** Activates or deactivates the GameObject locally, according to the value of the supplied parameter.
            * @param $value The active state to set, where true sets the GameObject to active and false sets it to inactive.
            */
            public SetActive ($value: boolean) : void
            /** Checks if the specified tag is attached to the GameObject.
            * @param $tag The tag to check for on the GameObject.
            * @returns true if the GameObject has the given tag, false otherwise. 
            */
            public CompareTag ($tag: string) : boolean
            /** Checks if the specified tag is attached to the GameObject.
            * @param $tag A TagHandle representing the tag to check for on the GameObject.
            * @returns true if the GameObject has the given tag, false otherwise. 
            */
            public CompareTag ($tag: UnityEngine.TagHandle) : boolean
            public static FindGameObjectWithTag ($tag: string) : UnityEngine.GameObject
            /** Retrieves an array of all active GameObjects tagged with the specified tag. Returns an empty array if no GameObjects have the tag.
            * @param $tag The name of the tag to search for GameObjects by.
            */
            public static FindGameObjectsWithTag ($tag: string) : System.Array$1<UnityEngine.GameObject>
            /** Calls the specified method on every MonoBehaviour attached to the GameObject and on every ancestor of the behaviour.
            * @param $methodName The name of the MonoBehaviour method to call.
            * @param $value An optional parameter value to pass to the called method.
            * @param $options Whether an error should be raised if the method doesn't exist on the target object.
            */
            public SendMessageUpwards ($methodName: string, $value: any, $options: UnityEngine.SendMessageOptions) : void
            /** Calls the specified method on every MonoBehaviour attached to the GameObject and on every ancestor of the behaviour.
            * @param $methodName The name of the MonoBehaviour method to call.
            * @param $value An optional parameter value to pass to the called method.
            * @param $options Whether an error should be raised if the method doesn't exist on the target object.
            */
            public SendMessageUpwards ($methodName: string, $value: any) : void
            /** Calls the specified method on every MonoBehaviour attached to the GameObject and on every ancestor of the behaviour.
            * @param $methodName The name of the MonoBehaviour method to call.
            * @param $value An optional parameter value to pass to the called method.
            * @param $options Whether an error should be raised if the method doesn't exist on the target object.
            */
            public SendMessageUpwards ($methodName: string) : void
            /** Calls the specified method on every MonoBehaviour attached to the GameObject.
            * @param $methodName The name of the MonoBehaviour method to call.
            * @param $value An optional parameter value to pass to the called method.
            * @param $options Whether an error should be raised if the method doesn't exist on the target object.
            */
            public SendMessage ($methodName: string, $value: any, $options: UnityEngine.SendMessageOptions) : void
            /** Calls the specified method on every MonoBehaviour attached to the GameObject.
            * @param $methodName The name of the MonoBehaviour method to call.
            * @param $value An optional parameter value to pass to the called method.
            * @param $options Whether an error should be raised if the method doesn't exist on the target object.
            */
            public SendMessage ($methodName: string, $value: any) : void
            /** Calls the specified method on every MonoBehaviour attached to the GameObject.
            * @param $methodName The name of the MonoBehaviour method to call.
            * @param $value An optional parameter value to pass to the called method.
            * @param $options Whether an error should be raised if the method doesn't exist on the target object.
            */
            public SendMessage ($methodName: string) : void
            /** Calls the specified method on every MonoBehaviour attached to the GameObject or any of its children.
            * @param $methodName The name of the MonoBehaviour method to call.
            * @param $parameter An optional parameter value to pass to the called method.
            * @param $options Whether an error should be raised if the method doesn't exist on the target object.
            */
            public BroadcastMessage ($methodName: string, $parameter: any, $options: UnityEngine.SendMessageOptions) : void
            /** Calls the specified method on every MonoBehaviour attached to the GameObject or any of its children.
            * @param $methodName The name of the MonoBehaviour method to call.
            * @param $parameter An optional parameter value to pass to the called method.
            * @param $options Whether an error should be raised if the method doesn't exist on the target object.
            */
            public BroadcastMessage ($methodName: string, $parameter: any) : void
            /** Calls the specified method on every MonoBehaviour attached to the GameObject or any of its children.
            * @param $methodName The name of the MonoBehaviour method to call.
            * @param $parameter An optional parameter value to pass to the called method.
            * @param $options Whether an error should be raised if the method doesn't exist on the target object.
            */
            public BroadcastMessage ($methodName: string) : void
            /** Finds and returns a GameObject with the specified name.
            * @param $name The name of the GameObject to find.
            */
            public static Find ($name: string) : UnityEngine.GameObject
            public static SetGameObjectsActive ($instanceIDs: Unity.Collections.NativeArray$1<number>, $active: boolean) : void
            public static InstantiateGameObjects ($sourceInstanceID: number, $count: number, $newInstanceIDs: Unity.Collections.NativeArray$1<number>, $newTransformInstanceIDs: Unity.Collections.NativeArray$1<number>, $destinationScene?: UnityEngine.SceneManagement.Scene) : void
            /** Retrieves the Scene which contains the GameObject with the specified instance ID.
            * @param $instanceID The instance ID of the GameObject.
            * @returns The Scene the GameObject with the specified instance ID is part of. 
            */
            public static GetScene ($instanceID: number) : UnityEngine.SceneManagement.Scene
            public constructor ($name: string)
            public constructor ()
            public constructor ($name: string, ...components: System.Type[])
        }
        /** Base class for everything attached to a GameObject.
        */
        class Component extends UnityEngine.Object
        {
            protected [__keep_incompatibility]: never;
            /** The Transform attached to this GameObject.
            */
            public get transform(): UnityEngine.Transform;
            /** The game object this component is attached to. A component is always attached to a game object.
            */
            public get gameObject(): UnityEngine.GameObject;
            /** The tag of this game object.
            */
            public get tag(): string;
            public set tag(value: string);
            /** The non-generic version of this method.
            * @param $type The type of Component to retrieve.
            * @returns A Component of the matching type, otherwise null if no Component is found. 
            */
            public GetComponent ($type: System.Type) : UnityEngine.Component
            /** The non-generic version of this method.
            * @param $type The type of component to search for.
            * @param $component The output argument that will contain the component or null.
            * @returns Returns true if the component is found, false otherwise. 
            */
            public TryGetComponent ($type: System.Type, $component: $Ref<UnityEngine.Component>) : boolean
            /** The string-based version of this method.
            * @param $type The name of the type of Component to get.
            * @returns A Component of the matching type, otherwise null if no Component is found. 
            */
            public GetComponent ($type: string) : UnityEngine.Component
            /** This is the non-generic version of this method.
            * @param $t The type of component to search for.
            * @param $includeInactive Whether to include inactive child GameObjects in the search.
            * @returns A Component of the matching type, otherwise null if no Component is found. 
            */
            public GetComponentInChildren ($t: System.Type, $includeInactive: boolean) : UnityEngine.Component
            /** This is the non-generic version of this method.
            * @param $t The type of component to search for.
            * @param $includeInactive Whether to include inactive child GameObjects in the search.
            * @returns A Component of the matching type, otherwise null if no Component is found. 
            */
            public GetComponentInChildren ($t: System.Type) : UnityEngine.Component
            /** The non-generic version of this method.
            * @param $t The type of component to search for.
            * @param $includeInactive Whether to include inactive child GameObjects in the search.
            * @returns An array of all found components matching the specified type. 
            */
            public GetComponentsInChildren ($t: System.Type, $includeInactive: boolean) : System.Array$1<UnityEngine.Component>
            public GetComponentsInChildren ($t: System.Type) : System.Array$1<UnityEngine.Component>
            /** The non-generic version of this method.
            * @param $t The type of component to search for.
            * @param $includeInactive Whether to include inactive parent GameObjects in the search.
            * @returns A Component of the matching type, otherwise null if no Component is found. 
            */
            public GetComponentInParent ($t: System.Type, $includeInactive: boolean) : UnityEngine.Component
            /** The non-generic version of this method.
            * @param $t The type of component to search for.
            * @param $includeInactive Whether to include inactive parent GameObjects in the search.
            * @returns A Component of the matching type, otherwise null if no Component is found. 
            */
            public GetComponentInParent ($t: System.Type) : UnityEngine.Component
            /** The non-generic version of this method.
            * @param $t The type of component to search for.
            * @param $includeInactive Whether to include inactive parent GameObjects in the search.
            * @returns An array of all found components matching the specified type. 
            */
            public GetComponentsInParent ($t: System.Type, $includeInactive: boolean) : System.Array$1<UnityEngine.Component>
            public GetComponentsInParent ($t: System.Type) : System.Array$1<UnityEngine.Component>
            /** The non-generic version of this method.
            * @param $type The type of component to search for.
            * @returns An array containing all matching components of type type. 
            */
            public GetComponents ($type: System.Type) : System.Array$1<UnityEngine.Component>
            public GetComponents ($type: System.Type, $results: System.Collections.Generic.List$1<UnityEngine.Component>) : void
            /** Gets the index of the component on its parent GameObject.
            * @returns The component index. 
            */
            public GetComponentIndex () : number
            /** Checks the GameObject's tag against the defined tag.
            * @param $tag The tag to compare.
            * @returns Returns true if GameObject has same tag. Returns false otherwise. 
            */
            public CompareTag ($tag: string) : boolean
            /** Checks the GameObject's tag against the defined tag.
            * @param $tag A TagHandle representing the tag to compare.
            * @returns Returns true if GameObject has same tag. Returns false otherwise. 
            */
            public CompareTag ($tag: UnityEngine.TagHandle) : boolean
            /** Calls the method named methodName on every MonoBehaviour in this game object and on every ancestor of the behaviour.
            * @param $methodName Name of method to call.
            * @param $value Optional parameter value for the method.
            * @param $options Should an error be raised if the method does not exist on the target object?
            */
            public SendMessageUpwards ($methodName: string, $value: any, $options: UnityEngine.SendMessageOptions) : void
            /** Calls the method named methodName on every MonoBehaviour in this game object and on every ancestor of the behaviour.
            * @param $methodName Name of method to call.
            * @param $value Optional parameter value for the method.
            * @param $options Should an error be raised if the method does not exist on the target object?
            */
            public SendMessageUpwards ($methodName: string, $value: any) : void
            /** Calls the method named methodName on every MonoBehaviour in this game object and on every ancestor of the behaviour.
            * @param $methodName Name of method to call.
            * @param $value Optional parameter value for the method.
            * @param $options Should an error be raised if the method does not exist on the target object?
            */
            public SendMessageUpwards ($methodName: string) : void
            /** Calls the method named methodName on every MonoBehaviour in this game object and on every ancestor of the behaviour.
            * @param $methodName Name of method to call.
            * @param $value Optional parameter value for the method.
            * @param $options Should an error be raised if the method does not exist on the target object?
            */
            public SendMessageUpwards ($methodName: string, $options: UnityEngine.SendMessageOptions) : void
            /** Calls the method named methodName on every MonoBehaviour in this game object.
            * @param $methodName Name of the method to call.
            * @param $value Optional parameter for the method.
            * @param $options Should an error be raised if the target object doesn't implement the method for the message?
            */
            public SendMessage ($methodName: string, $value: any) : void
            /** Calls the method named methodName on every MonoBehaviour in this game object.
            * @param $methodName Name of the method to call.
            * @param $value Optional parameter for the method.
            * @param $options Should an error be raised if the target object doesn't implement the method for the message?
            */
            public SendMessage ($methodName: string) : void
            /** Calls the method named methodName on every MonoBehaviour in this game object.
            * @param $methodName Name of the method to call.
            * @param $value Optional parameter for the method.
            * @param $options Should an error be raised if the target object doesn't implement the method for the message?
            */
            public SendMessage ($methodName: string, $value: any, $options: UnityEngine.SendMessageOptions) : void
            /** Calls the method named methodName on every MonoBehaviour in this game object.
            * @param $methodName Name of the method to call.
            * @param $value Optional parameter for the method.
            * @param $options Should an error be raised if the target object doesn't implement the method for the message?
            */
            public SendMessage ($methodName: string, $options: UnityEngine.SendMessageOptions) : void
            /** Calls the method named methodName on every MonoBehaviour in this game object or any of its children.
            * @param $methodName Name of the method to call.
            * @param $parameter Optional parameter to pass to the method (can be any value).
            * @param $options Should an error be raised if the method does not exist for a given target object?
            */
            public BroadcastMessage ($methodName: string, $parameter: any, $options: UnityEngine.SendMessageOptions) : void
            /** Calls the method named methodName on every MonoBehaviour in this game object or any of its children.
            * @param $methodName Name of the method to call.
            * @param $parameter Optional parameter to pass to the method (can be any value).
            * @param $options Should an error be raised if the method does not exist for a given target object?
            */
            public BroadcastMessage ($methodName: string, $parameter: any) : void
            /** Calls the method named methodName on every MonoBehaviour in this game object or any of its children.
            * @param $methodName Name of the method to call.
            * @param $parameter Optional parameter to pass to the method (can be any value).
            * @param $options Should an error be raised if the method does not exist for a given target object?
            */
            public BroadcastMessage ($methodName: string) : void
            /** Calls the method named methodName on every MonoBehaviour in this game object or any of its children.
            * @param $methodName Name of the method to call.
            * @param $parameter Optional parameter to pass to the method (can be any value).
            * @param $options Should an error be raised if the method does not exist for a given target object?
            */
            public BroadcastMessage ($methodName: string, $options: UnityEngine.SendMessageOptions) : void
            public constructor ()
        }
        /** Position, rotation and scale of an object.
        */
        class Transform extends UnityEngine.Component implements System.Collections.IEnumerable
        {
            protected [__keep_incompatibility]: never;
            /** The world space position of the Transform.
            */
            public get position(): UnityEngine.Vector3;
            public set position(value: UnityEngine.Vector3);
            /** Position of the transform relative to the parent transform.
            */
            public get localPosition(): UnityEngine.Vector3;
            public set localPosition(value: UnityEngine.Vector3);
            /** The rotation as Euler angles in degrees.
            */
            public get eulerAngles(): UnityEngine.Vector3;
            public set eulerAngles(value: UnityEngine.Vector3);
            /** The rotation as Euler angles in degrees relative to the parent transform's rotation.
            */
            public get localEulerAngles(): UnityEngine.Vector3;
            public set localEulerAngles(value: UnityEngine.Vector3);
            /** The red axis of the transform in world space.
            */
            public get right(): UnityEngine.Vector3;
            public set right(value: UnityEngine.Vector3);
            /** The green axis of the transform in world space.
            */
            public get up(): UnityEngine.Vector3;
            public set up(value: UnityEngine.Vector3);
            /** Returns a normalized vector representing the blue axis of the transform in world space.
            */
            public get forward(): UnityEngine.Vector3;
            public set forward(value: UnityEngine.Vector3);
            /** A Quaternion that stores the rotation of the Transform in world space.
            */
            public get rotation(): UnityEngine.Quaternion;
            public set rotation(value: UnityEngine.Quaternion);
            /** The rotation of the transform relative to the transform rotation of the parent.
            */
            public get localRotation(): UnityEngine.Quaternion;
            public set localRotation(value: UnityEngine.Quaternion);
            /** The scale of the transform relative to the GameObjects parent.
            */
            public get localScale(): UnityEngine.Vector3;
            public set localScale(value: UnityEngine.Vector3);
            /** The parent of the transform.
            */
            public get parent(): UnityEngine.Transform;
            public set parent(value: UnityEngine.Transform);
            /** Matrix that transforms a point from world space into local space (Read Only).
            */
            public get worldToLocalMatrix(): UnityEngine.Matrix4x4;
            /** Matrix that transforms a point from local space into world space (Read Only).
            */
            public get localToWorldMatrix(): UnityEngine.Matrix4x4;
            /** Returns the topmost transform in the hierarchy.
            */
            public get root(): UnityEngine.Transform;
            /** The number of children the parent Transform has.
            */
            public get childCount(): number;
            /** The global scale of the object (Read Only).
            */
            public get lossyScale(): UnityEngine.Vector3;
            /** Has the transform changed since the last time the flag was set to 'false'?
            */
            public get hasChanged(): boolean;
            public set hasChanged(value: boolean);
            /** The transform capacity of the transform's hierarchy data structure.
            */
            public get hierarchyCapacity(): number;
            public set hierarchyCapacity(value: number);
            /** The number of transforms in the transform's hierarchy data structure.
            */
            public get hierarchyCount(): number;
            /** Set the parent of the transform.
            * @param $parent The parent Transform to use.
            * @param $worldPositionStays If true, the parent-relative position, scale and rotation are modified such that the object keeps the same world space position, rotation and scale as before.
            */
            public SetParent ($p: UnityEngine.Transform) : void
            /** Set the parent of the transform.
            * @param $parent The parent Transform to use.
            * @param $worldPositionStays If true, the parent-relative position, scale and rotation are modified such that the object keeps the same world space position, rotation and scale as before.
            */
            public SetParent ($parent: UnityEngine.Transform, $worldPositionStays: boolean) : void
            /** Sets the world space position and rotation of the Transform component.
            */
            public SetPositionAndRotation ($position: UnityEngine.Vector3, $rotation: UnityEngine.Quaternion) : void
            /** Sets the position and rotation of the Transform component in local space (i.e. relative to its parent transform).
            */
            public SetLocalPositionAndRotation ($localPosition: UnityEngine.Vector3, $localRotation: UnityEngine.Quaternion) : void
            /** Gets the position and rotation of the Transform component in world space.
            */
            public GetPositionAndRotation ($position: $Ref<UnityEngine.Vector3>, $rotation: $Ref<UnityEngine.Quaternion>) : void
            /** Gets the position and rotation of the Transform component in local space (that is, relative to its parent transform).
            */
            public GetLocalPositionAndRotation ($localPosition: $Ref<UnityEngine.Vector3>, $localRotation: $Ref<UnityEngine.Quaternion>) : void
            /** Moves the transform in the direction and distance of translation.
            */
            public Translate ($translation: UnityEngine.Vector3, $relativeTo: UnityEngine.Space) : void
            /** Moves the transform in the direction and distance of translation.
            */
            public Translate ($translation: UnityEngine.Vector3) : void
            /** Moves the transform by x along the x axis, y along the y axis, and z along the z axis.
            */
            public Translate ($x: number, $y: number, $z: number, $relativeTo: UnityEngine.Space) : void
            /** Moves the transform by x along the x axis, y along the y axis, and z along the z axis.
            */
            public Translate ($x: number, $y: number, $z: number) : void
            /** Moves the transform in the direction and distance of translation.
            */
            public Translate ($translation: UnityEngine.Vector3, $relativeTo: UnityEngine.Transform) : void
            /** Moves the transform by x along the x axis, y along the y axis, and z along the z axis.
            */
            public Translate ($x: number, $y: number, $z: number, $relativeTo: UnityEngine.Transform) : void
            /** Applies a rotation of eulerAngles.z degrees around the z-axis, eulerAngles.x degrees around the x-axis, and eulerAngles.y degrees around the y-axis (in that order).
            * @param $eulers The rotation to apply in euler angles.
            * @param $relativeTo Determines whether to rotate the GameObject either locally to  the GameObject or relative to the Scene in world space.
            */
            public Rotate ($eulers: UnityEngine.Vector3, $relativeTo: UnityEngine.Space) : void
            /** Applies a rotation of eulerAngles.z degrees around the z-axis, eulerAngles.x degrees around the x-axis, and eulerAngles.y degrees around the y-axis (in that order).
            * @param $eulers The rotation to apply in euler angles.
            */
            public Rotate ($eulers: UnityEngine.Vector3) : void
            /** The implementation of this method applies a rotation of zAngle degrees around the z axis, xAngle degrees around the x axis, and yAngle degrees around the y axis (in that order).
            * @param $xAngle Degrees to rotate the GameObject around the X axis.
            * @param $yAngle Degrees to rotate the GameObject around the Y axis.
            * @param $zAngle Degrees to rotate the GameObject around the Z axis.
            * @param $relativeTo Determines whether to rotate the GameObject either locally to the GameObject or relative to the Scene in world space.
            */
            public Rotate ($xAngle: number, $yAngle: number, $zAngle: number, $relativeTo: UnityEngine.Space) : void
            /** The implementation of this method applies a rotation of zAngle degrees around the z axis, xAngle degrees around the x axis, and yAngle degrees around the y axis (in that order).
            * @param $xAngle Degrees to rotate the GameObject around the X axis.
            * @param $yAngle Degrees to rotate the GameObject around the Y axis.
            * @param $zAngle Degrees to rotate the GameObject around the Z axis.
            */
            public Rotate ($xAngle: number, $yAngle: number, $zAngle: number) : void
            /** Rotates the object around the given axis by the number of degrees defined by the given angle.
            * @param $axis The axis to apply rotation to.
            * @param $angle The degrees of rotation to apply.
            * @param $relativeTo Determines whether to rotate the GameObject either locally to the GameObject or relative to the Scene in world space.
            */
            public Rotate ($axis: UnityEngine.Vector3, $angle: number, $relativeTo: UnityEngine.Space) : void
            /** Rotates the object around the given axis by the number of degrees defined by the given angle.
            * @param $axis The axis to apply rotation to.
            * @param $angle The degrees of rotation to apply.
            */
            public Rotate ($axis: UnityEngine.Vector3, $angle: number) : void
            /** Rotates the transform about axis passing through point in world coordinates by angle degrees.
            */
            public RotateAround ($point: UnityEngine.Vector3, $axis: UnityEngine.Vector3, $angle: number) : void
            /** Rotates the transform so the forward vector points at target's current position.
            * @param $target Object to point towards.
            * @param $worldUp Vector specifying the upward direction.
            */
            public LookAt ($target: UnityEngine.Transform, $worldUp: UnityEngine.Vector3) : void
            /** Rotates the transform so the forward vector points at target's current position.
            * @param $target Object to point towards.
            * @param $worldUp Vector specifying the upward direction.
            */
            public LookAt ($target: UnityEngine.Transform) : void
            /** Rotates the transform so the forward vector points at worldPosition.
            * @param $worldPosition Point to look at.
            * @param $worldUp Vector specifying the upward direction.
            */
            public LookAt ($worldPosition: UnityEngine.Vector3, $worldUp: UnityEngine.Vector3) : void
            /** Rotates the transform so the forward vector points at worldPosition.
            * @param $worldPosition Point to look at.
            * @param $worldUp Vector specifying the upward direction.
            */
            public LookAt ($worldPosition: UnityEngine.Vector3) : void
            /** Transforms direction from local space to world space.
            */
            public TransformDirection ($direction: UnityEngine.Vector3) : UnityEngine.Vector3
            /** Transforms direction x, y, z from local space to world space.
            */
            public TransformDirection ($x: number, $y: number, $z: number) : UnityEngine.Vector3
            /** Transforms a direction from world space to local space. The opposite of Transform.TransformDirection.
            */
            public InverseTransformDirection ($direction: UnityEngine.Vector3) : UnityEngine.Vector3
            /** Transforms the direction x, y, z from world space to local space. The opposite of Transform.TransformDirection.
            */
            public InverseTransformDirection ($x: number, $y: number, $z: number) : UnityEngine.Vector3
            /** Transforms vector from local space to world space.
            */
            public TransformVector ($vector: UnityEngine.Vector3) : UnityEngine.Vector3
            /** Transforms vector x, y, z from local space to world space.
            */
            public TransformVector ($x: number, $y: number, $z: number) : UnityEngine.Vector3
            /** Transforms a vector from world space to local space. The opposite of Transform.TransformVector.
            */
            public InverseTransformVector ($vector: UnityEngine.Vector3) : UnityEngine.Vector3
            /** Transforms the vector x, y, z from world space to local space. The opposite of Transform.TransformVector.
            */
            public InverseTransformVector ($x: number, $y: number, $z: number) : UnityEngine.Vector3
            /** Transforms position from local space to world space.
            */
            public TransformPoint ($position: UnityEngine.Vector3) : UnityEngine.Vector3
            /** Transforms the position x, y, z from local space to world space.
            */
            public TransformPoint ($x: number, $y: number, $z: number) : UnityEngine.Vector3
            /** Transforms position from world space to local space.
            */
            public InverseTransformPoint ($position: UnityEngine.Vector3) : UnityEngine.Vector3
            /** Transforms the position x, y, z from world space to local space.
            */
            public InverseTransformPoint ($x: number, $y: number, $z: number) : UnityEngine.Vector3
            /** Unparents all children.
            */
            public DetachChildren () : void
            /** Move the transform to the start of the local transform list.
            */
            public SetAsFirstSibling () : void
            /** Move the transform to the end of the local transform list.
            */
            public SetAsLastSibling () : void
            /** Sets the sibling index.
            * @param $index Index to set.
            */
            public SetSiblingIndex ($index: number) : void
            /** Gets the sibling index.
            */
            public GetSiblingIndex () : number
            /** Finds a child by name n and returns it.
            * @param $n The search string, either the name of an immediate child or a hierarchy path for finding a descendent.
            * @returns The found child transform. Null if child with matching name isn't found. 
            */
            public Find ($n: string) : UnityEngine.Transform
            /** Is this transform a child of parent?
            */
            public IsChildOf ($parent: UnityEngine.Transform) : boolean
            public GetEnumerator () : System.Collections.IEnumerator
            /** Returns a transform child by index.
            * @param $index Index of the child transform to return. Must be smaller than Transform.childCount.
            * @returns Transform child by index. 
            */
            public GetChild ($index: number) : UnityEngine.Transform
        }
        /** Behaviours are Components that can be enabled or disabled.
        */
        class Behaviour extends UnityEngine.Component
        {
            protected [__keep_incompatibility]: never;
            /** Enabled Behaviours are Updated, disabled Behaviours are not.
            */
            public get enabled(): boolean;
            public set enabled(value: boolean);
            /** Reports whether a GameObject and its associated Behaviour is active and enabled.
            */
            public get isActiveAndEnabled(): boolean;
            public constructor ()
        }
        /** MonoBehaviour is a base class that many Unity scripts derive from.
        */
        class MonoBehaviour extends UnityEngine.Behaviour
        {
            protected [__keep_incompatibility]: never;
            /** Cancellation token raised when the MonoBehaviour is destroyed (Read Only).
            */
            public get destroyCancellationToken(): System.Threading.CancellationToken;
            /** Disabling this lets you skip the GUI layout phase.
            */
            public get useGUILayout(): boolean;
            public set useGUILayout(value: boolean);
            /** Returns a boolean value which represents if Start was called.
            */
            public get didStart(): boolean;
            /** Returns a boolean value which represents if Awake was called.
            */
            public get didAwake(): boolean;
            /** Allow a specific instance of a MonoBehaviour to run in edit mode (only available in the editor).
            */
            public get runInEditMode(): boolean;
            public set runInEditMode(value: boolean);
            /** Is any invoke pending on this MonoBehaviour?
            */
            public IsInvoking () : boolean
            /** Cancels all Invoke calls on this MonoBehaviour.
            */
            public CancelInvoke () : void
            /** Invokes the method methodName in time seconds.
            */
            public Invoke ($methodName: string, $time: number) : void
            /** Invokes the method methodName in time seconds, then repeatedly every repeatRate seconds.
            * @param $methodName The name of a method to invoke.
            * @param $time Start invoking after n seconds.
            * @param $repeatRate Repeat every n seconds.
            */
            public InvokeRepeating ($methodName: string, $time: number, $repeatRate: number) : void
            /** Cancels all Invoke calls with name methodName on this behaviour.
            */
            public CancelInvoke ($methodName: string) : void
            /** Is any invoke on methodName pending?
            */
            public IsInvoking ($methodName: string) : boolean
            /** Starts a coroutine named methodName.
            */
            public StartCoroutine ($methodName: string) : UnityEngine.Coroutine
            /** Starts a coroutine named methodName.
            */
            public StartCoroutine ($methodName: string, $value: any) : UnityEngine.Coroutine
            /** Starts a Coroutine.
            */
            public StartCoroutine ($routine: System.Collections.IEnumerator) : UnityEngine.Coroutine
            /** Stops the first coroutine named methodName, or the coroutine stored in routine running on this behaviour.
            * @param $methodName Name of coroutine.
            * @param $routine Name of the function in code, including coroutines.
            */
            public StopCoroutine ($routine: System.Collections.IEnumerator) : void
            /** Stops the first coroutine named methodName, or the coroutine stored in routine running on this behaviour.
            * @param $methodName Name of coroutine.
            * @param $routine Name of the function in code, including coroutines.
            */
            public StopCoroutine ($routine: UnityEngine.Coroutine) : void
            /** Stops the first coroutine named methodName, or the coroutine stored in routine running on this behaviour.
            * @param $methodName Name of coroutine.
            * @param $routine Name of the function in code, including coroutines.
            */
            public StopCoroutine ($methodName: string) : void
            /** Stops all coroutines running on this behaviour.
            */
            public StopAllCoroutines () : void
            /** Logs message to the Unity Console (identical to Debug.Log).
            */
            public static print ($message: any) : void
            public constructor ()
        }
        /** Representation of 2D vectors and points using integers.
        */
        class Vector2Int extends System.ValueType implements System.IFormattable, System.IEquatable$1<UnityEngine.Vector2Int>
        {
            protected [__keep_incompatibility]: never;
            /** X component of the vector.
            */
            public get x(): number;
            public set x(value: number);
            /** Y component of the vector.
            */
            public get y(): number;
            public set y(value: number);
            /** Returns the length of this vector (Read Only).
            */
            public get magnitude(): number;
            /** Returns the squared length of this vector (Read Only).
            */
            public get sqrMagnitude(): number;
            /** Shorthand for writing Vector2Int(0, 0).
            */
            public static get zero(): UnityEngine.Vector2Int;
            /** Shorthand for writing Vector2Int(1, 1).
            */
            public static get one(): UnityEngine.Vector2Int;
            /** Shorthand for writing Vector2Int(0, 1).
            */
            public static get up(): UnityEngine.Vector2Int;
            /** Shorthand for writing Vector2Int(0, -1).
            */
            public static get down(): UnityEngine.Vector2Int;
            /** Shorthand for writing Vector2Int(-1, 0).
            */
            public static get left(): UnityEngine.Vector2Int;
            /** Shorthand for writing Vector2Int(1, 0).
            */
            public static get right(): UnityEngine.Vector2Int;
            /** Set x and y components of an existing Vector2Int.
            */
            public Set ($x: number, $y: number) : void
            public get_Item ($index: number) : number
            public set_Item ($index: number, $value: number) : void
            /** Returns the distance between a and b.
            */
            public static Distance ($a: UnityEngine.Vector2Int, $b: UnityEngine.Vector2Int) : number
            /** Returns a vector that is made from the smallest components of two vectors.
            */
            public static Min ($lhs: UnityEngine.Vector2Int, $rhs: UnityEngine.Vector2Int) : UnityEngine.Vector2Int
            /** Returns a vector that is made from the largest components of two vectors.
            */
            public static Max ($lhs: UnityEngine.Vector2Int, $rhs: UnityEngine.Vector2Int) : UnityEngine.Vector2Int
            /** Multiplies two vectors component-wise.
            */
            public static Scale ($a: UnityEngine.Vector2Int, $b: UnityEngine.Vector2Int) : UnityEngine.Vector2Int
            /** Multiplies every component of this vector by the same component of scale.
            */
            public Scale ($scale: UnityEngine.Vector2Int) : void
            /** Clamps the Vector2Int to the bounds given by min and max.
            */
            public Clamp ($min: UnityEngine.Vector2Int, $max: UnityEngine.Vector2Int) : void
            public static op_Implicit ($v: UnityEngine.Vector2Int) : UnityEngine.Vector2
            public static op_Explicit ($v: UnityEngine.Vector2Int) : UnityEngine.Vector3Int
            /** Converts a Vector2 to a Vector2Int by doing a Floor to each value.
            */
            public static FloorToInt ($v: UnityEngine.Vector2) : UnityEngine.Vector2Int
            /** Converts a  Vector2 to a Vector2Int by doing a Ceiling to each value.
            */
            public static CeilToInt ($v: UnityEngine.Vector2) : UnityEngine.Vector2Int
            /** Converts a  Vector2 to a Vector2Int by doing a Round to each value.
            */
            public static RoundToInt ($v: UnityEngine.Vector2) : UnityEngine.Vector2Int
            public static op_UnaryNegation ($v: UnityEngine.Vector2Int) : UnityEngine.Vector2Int
            public static op_Addition ($a: UnityEngine.Vector2Int, $b: UnityEngine.Vector2Int) : UnityEngine.Vector2Int
            public static op_Subtraction ($a: UnityEngine.Vector2Int, $b: UnityEngine.Vector2Int) : UnityEngine.Vector2Int
            public static op_Multiply ($a: UnityEngine.Vector2Int, $b: UnityEngine.Vector2Int) : UnityEngine.Vector2Int
            public static op_Multiply ($a: number, $b: UnityEngine.Vector2Int) : UnityEngine.Vector2Int
            public static op_Multiply ($a: UnityEngine.Vector2Int, $b: number) : UnityEngine.Vector2Int
            public static op_Division ($a: UnityEngine.Vector2Int, $b: number) : UnityEngine.Vector2Int
            public static op_Equality ($lhs: UnityEngine.Vector2Int, $rhs: UnityEngine.Vector2Int) : boolean
            public static op_Inequality ($lhs: UnityEngine.Vector2Int, $rhs: UnityEngine.Vector2Int) : boolean
            /** Returns true if the objects are equal.
            */
            public Equals ($other: any) : boolean
            public Equals ($other: UnityEngine.Vector2Int) : boolean
            /** Returns a formatted string for this vector.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString () : string
            /** Returns a formatted string for this vector.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string) : string
            /** Returns a formatted string for this vector.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string, $formatProvider: System.IFormatProvider) : string
            public constructor ($x: number, $y: number)
        }
        /** Representation of 3D vectors and points using integers.
        */
        class Vector3Int extends System.ValueType implements System.IFormattable, System.IEquatable$1<UnityEngine.Vector3Int>
        {
            protected [__keep_incompatibility]: never;
            /** X component of the vector.
            */
            public get x(): number;
            public set x(value: number);
            /** Y component of the vector.
            */
            public get y(): number;
            public set y(value: number);
            /** Z component of the vector.
            */
            public get z(): number;
            public set z(value: number);
            /** Returns the length of this vector (Read Only).
            */
            public get magnitude(): number;
            /** Returns the squared length of this vector (Read Only).
            */
            public get sqrMagnitude(): number;
            /** Shorthand for writing Vector3Int(0, 0, 0).
            */
            public static get zero(): UnityEngine.Vector3Int;
            /** Shorthand for writing Vector3Int(1, 1, 1).
            */
            public static get one(): UnityEngine.Vector3Int;
            /** Shorthand for writing Vector3Int(0, 1, 0).
            */
            public static get up(): UnityEngine.Vector3Int;
            /** Shorthand for writing Vector3Int(0, -1, 0).
            */
            public static get down(): UnityEngine.Vector3Int;
            /** Shorthand for writing Vector3Int(-1, 0, 0).
            */
            public static get left(): UnityEngine.Vector3Int;
            /** Shorthand for writing Vector3Int(1, 0, 0).
            */
            public static get right(): UnityEngine.Vector3Int;
            /** Shorthand for writing Vector3Int(0, 0, 1).
            */
            public static get forward(): UnityEngine.Vector3Int;
            /** Shorthand for writing Vector3Int(0, 0, -1).
            */
            public static get back(): UnityEngine.Vector3Int;
            /** Set x, y and z components of an existing Vector3Int.
            */
            public Set ($x: number, $y: number, $z: number) : void
            public get_Item ($index: number) : number
            public set_Item ($index: number, $value: number) : void
            /** Returns the distance between a and b.
            */
            public static Distance ($a: UnityEngine.Vector3Int, $b: UnityEngine.Vector3Int) : number
            /** Returns a vector that is made from the smallest components of two vectors.
            */
            public static Min ($lhs: UnityEngine.Vector3Int, $rhs: UnityEngine.Vector3Int) : UnityEngine.Vector3Int
            /** Returns a vector that is made from the largest components of two vectors.
            */
            public static Max ($lhs: UnityEngine.Vector3Int, $rhs: UnityEngine.Vector3Int) : UnityEngine.Vector3Int
            /** Multiplies two vectors component-wise.
            */
            public static Scale ($a: UnityEngine.Vector3Int, $b: UnityEngine.Vector3Int) : UnityEngine.Vector3Int
            /** Multiplies every component of this vector by the same component of scale.
            */
            public Scale ($scale: UnityEngine.Vector3Int) : void
            /** Clamps the Vector3Int to the bounds given by min and max.
            */
            public Clamp ($min: UnityEngine.Vector3Int, $max: UnityEngine.Vector3Int) : void
            public static op_Implicit ($v: UnityEngine.Vector3Int) : UnityEngine.Vector3
            public static op_Explicit ($v: UnityEngine.Vector3Int) : UnityEngine.Vector2Int
            /** Converts a  Vector3 to a Vector3Int by doing a Floor to each value.
            */
            public static FloorToInt ($v: UnityEngine.Vector3) : UnityEngine.Vector3Int
            /** Converts a  Vector3 to a Vector3Int by doing a Ceiling to each value.
            */
            public static CeilToInt ($v: UnityEngine.Vector3) : UnityEngine.Vector3Int
            /** Converts a  Vector3 to a Vector3Int by doing a Round to each value.
            */
            public static RoundToInt ($v: UnityEngine.Vector3) : UnityEngine.Vector3Int
            public static op_Addition ($a: UnityEngine.Vector3Int, $b: UnityEngine.Vector3Int) : UnityEngine.Vector3Int
            public static op_Subtraction ($a: UnityEngine.Vector3Int, $b: UnityEngine.Vector3Int) : UnityEngine.Vector3Int
            public static op_Multiply ($a: UnityEngine.Vector3Int, $b: UnityEngine.Vector3Int) : UnityEngine.Vector3Int
            public static op_UnaryNegation ($a: UnityEngine.Vector3Int) : UnityEngine.Vector3Int
            public static op_Multiply ($a: UnityEngine.Vector3Int, $b: number) : UnityEngine.Vector3Int
            public static op_Multiply ($a: number, $b: UnityEngine.Vector3Int) : UnityEngine.Vector3Int
            public static op_Division ($a: UnityEngine.Vector3Int, $b: number) : UnityEngine.Vector3Int
            public static op_Equality ($lhs: UnityEngine.Vector3Int, $rhs: UnityEngine.Vector3Int) : boolean
            public static op_Inequality ($lhs: UnityEngine.Vector3Int, $rhs: UnityEngine.Vector3Int) : boolean
            /** Returns true if the objects are equal.
            */
            public Equals ($other: any) : boolean
            public Equals ($other: UnityEngine.Vector3Int) : boolean
            /** Returns a formatted string for this vector.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString () : string
            /** Returns a formatted string for this vector.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string) : string
            /** Returns a formatted string for this vector.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string, $formatProvider: System.IFormatProvider) : string
            public constructor ($x: number, $y: number)
            public constructor ($x: number, $y: number, $z: number)
        }
        /** A standard 4x4 transformation matrix.
        */
        class Matrix4x4 extends System.ValueType implements System.IFormattable, System.IEquatable$1<UnityEngine.Matrix4x4>
        {
            protected [__keep_incompatibility]: never;
            public m00 : number
            public m10 : number
            public m20 : number
            public m30 : number
            public m01 : number
            public m11 : number
            public m21 : number
            public m31 : number
            public m02 : number
            public m12 : number
            public m22 : number
            public m32 : number
            public m03 : number
            public m13 : number
            public m23 : number
            public m33 : number
            /** Attempts to get a rotation quaternion from this matrix.
            */
            public get rotation(): UnityEngine.Quaternion;
            /** Attempts to get a scale value from the matrix. (Read Only)
            */
            public get lossyScale(): UnityEngine.Vector3;
            /** Checks whether this is an identity matrix. (Read Only)
            */
            public get isIdentity(): boolean;
            /** The determinant of the matrix. (Read Only)
            */
            public get determinant(): number;
            /** This property takes a projection matrix and returns the six plane coordinates that define a projection frustum.
            */
            public get decomposeProjection(): UnityEngine.FrustumPlanes;
            /** The inverse of this matrix. (Read Only)
            */
            public get inverse(): UnityEngine.Matrix4x4;
            /** Returns the transpose of this matrix (Read Only).
            */
            public get transpose(): UnityEngine.Matrix4x4;
            /** Returns a matrix with all elements set to zero (Read Only).
            */
            public static get zero(): UnityEngine.Matrix4x4;
            /** Returns the identity matrix (Read Only).
            */
            public static get identity(): UnityEngine.Matrix4x4;
            /** Checks if this matrix is a valid transform matrix.
            */
            public ValidTRS () : boolean
            public static Determinant ($m: UnityEngine.Matrix4x4) : number
            /** Creates a translation, rotation and scaling matrix.
            */
            public static TRS ($pos: UnityEngine.Vector3, $q: UnityEngine.Quaternion, $s: UnityEngine.Vector3) : UnityEngine.Matrix4x4
            /** Sets this matrix to a translation, rotation and scaling matrix.
            */
            public SetTRS ($pos: UnityEngine.Vector3, $q: UnityEngine.Quaternion, $s: UnityEngine.Vector3) : void
            /** Computes the inverse of a 3D affine matrix.
            * @param $input Input matrix to invert.
            * @param $result The result of the inversion. Equal to the input matrix if the function fails.
            * @returns Returns true and a valid result if the function succeeds, false and a copy of the input matrix if the function fails. 
            */
            public static Inverse3DAffine ($input: UnityEngine.Matrix4x4, $result: $Ref<UnityEngine.Matrix4x4>) : boolean
            public static Inverse ($m: UnityEngine.Matrix4x4) : UnityEngine.Matrix4x4
            public static Transpose ($m: UnityEngine.Matrix4x4) : UnityEngine.Matrix4x4
            /** Create an orthogonal projection matrix.
            * @param $left Left-side x-coordinate.
            * @param $right Right-side x-coordinate.
            * @param $bottom Bottom y-coordinate.
            * @param $top Top y-coordinate.
            * @param $zNear Near depth clipping plane value.
            * @param $zFar Far depth clipping plane value.
            * @returns The projection matrix. 
            */
            public static Ortho ($left: number, $right: number, $bottom: number, $top: number, $zNear: number, $zFar: number) : UnityEngine.Matrix4x4
            /** Create a perspective projection matrix.
            * @param $fov Vertical field-of-view in degrees.
            * @param $aspect Aspect ratio (width divided by height).
            * @param $zNear Near depth clipping plane value.
            * @param $zFar Far depth clipping plane value.
            * @returns The projection matrix. 
            */
            public static Perspective ($fov: number, $aspect: number, $zNear: number, $zFar: number) : UnityEngine.Matrix4x4
            /** Create a "look at" matrix.
            * @param $from The source point.
            * @param $to The target point.
            * @param $up The vector describing the up direction (typically Vector3.up).
            * @returns The resulting transformation matrix. 
            */
            public static LookAt ($from: UnityEngine.Vector3, $to: UnityEngine.Vector3, $up: UnityEngine.Vector3) : UnityEngine.Matrix4x4
            /** This function returns a projection matrix with viewing frustum that has a near plane defined by the coordinates that were passed in.
            * @param $left The X coordinate of the left side of the near projection plane in view space.
            * @param $right The X coordinate of the right side of the near projection plane in view space.
            * @param $bottom The Y coordinate of the bottom side of the near projection plane in view space.
            * @param $top The Y coordinate of the top side of the near projection plane in view space.
            * @param $zNear Z distance to the near plane from the origin in view space.
            * @param $zFar Z distance to the far plane from the origin in view space.
            * @param $frustumPlanes Frustum planes struct that contains the view space coordinates of that define a viewing frustum.
            * @returns A projection matrix with a viewing frustum defined by the plane coordinates passed in. 
            */
            public static Frustum ($left: number, $right: number, $bottom: number, $top: number, $zNear: number, $zFar: number) : UnityEngine.Matrix4x4
            /** This function returns a projection matrix with viewing frustum that has a near plane defined by the coordinates that were passed in.
            * @param $left The X coordinate of the left side of the near projection plane in view space.
            * @param $right The X coordinate of the right side of the near projection plane in view space.
            * @param $bottom The Y coordinate of the bottom side of the near projection plane in view space.
            * @param $top The Y coordinate of the top side of the near projection plane in view space.
            * @param $zNear Z distance to the near plane from the origin in view space.
            * @param $zFar Z distance to the far plane from the origin in view space.
            * @param $frustumPlanes Frustum planes struct that contains the view space coordinates of that define a viewing frustum.
            * @returns A projection matrix with a viewing frustum defined by the plane coordinates passed in. 
            */
            public static Frustum ($fp: UnityEngine.FrustumPlanes) : UnityEngine.Matrix4x4
            public get_Item ($index: number) : number
            public set_Item ($index: number, $value: number) : void
            public Equals ($other: any) : boolean
            public Equals ($other: UnityEngine.Matrix4x4) : boolean
            public static op_Multiply ($lhs: UnityEngine.Matrix4x4, $rhs: UnityEngine.Matrix4x4) : UnityEngine.Matrix4x4
            public static op_Multiply ($lhs: UnityEngine.Matrix4x4, $vector: UnityEngine.Vector4) : UnityEngine.Vector4
            public static op_Equality ($lhs: UnityEngine.Matrix4x4, $rhs: UnityEngine.Matrix4x4) : boolean
            public static op_Inequality ($lhs: UnityEngine.Matrix4x4, $rhs: UnityEngine.Matrix4x4) : boolean
            /** Get a column of the matrix.
            */
            public GetColumn ($index: number) : UnityEngine.Vector4
            /** Returns a row of the matrix.
            */
            public GetRow ($index: number) : UnityEngine.Vector4
            /** Get position vector from the matrix.
            */
            public GetPosition () : UnityEngine.Vector3
            /** Sets a column of the matrix.
            */
            public SetColumn ($index: number, $column: UnityEngine.Vector4) : void
            /** Sets a row of the matrix.
            */
            public SetRow ($index: number, $row: UnityEngine.Vector4) : void
            /** Transforms a position by this matrix (generic).
            */
            public MultiplyPoint ($point: UnityEngine.Vector3) : UnityEngine.Vector3
            /** Transforms a position by this matrix (fast).
            */
            public MultiplyPoint3x4 ($point: UnityEngine.Vector3) : UnityEngine.Vector3
            /** Transforms a direction by this matrix.
            */
            public MultiplyVector ($vector: UnityEngine.Vector3) : UnityEngine.Vector3
            /** Returns a plane that is transformed in space.
            */
            public TransformPlane ($plane: UnityEngine.Plane) : UnityEngine.Plane
            /** Creates a scaling matrix.
            */
            public static Scale ($vector: UnityEngine.Vector3) : UnityEngine.Matrix4x4
            /** Creates a translation matrix.
            */
            public static Translate ($vector: UnityEngine.Vector3) : UnityEngine.Matrix4x4
            /** Creates a rotation matrix.
            */
            public static Rotate ($q: UnityEngine.Quaternion) : UnityEngine.Matrix4x4
            /** Returns a formatted string for this matrix.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString () : string
            /** Returns a formatted string for this matrix.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string) : string
            /** Returns a formatted string for this matrix.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string, $formatProvider: System.IFormatProvider) : string
            public constructor ($column0: UnityEngine.Vector4, $column1: UnityEngine.Vector4, $column2: UnityEngine.Vector4, $column3: UnityEngine.Vector4)
        }
        /** This struct contains the view space coordinates of the near projection plane.
        */
        class FrustumPlanes extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        /** Representation of a plane in 3D space.
        */
        class Plane extends System.ValueType implements System.IFormattable
        {
            protected [__keep_incompatibility]: never;
            /** Normal vector of the plane.
            */
            public get normal(): UnityEngine.Vector3;
            public set normal(value: UnityEngine.Vector3);
            /** The distance measured from the Plane to the origin, along the Plane's normal.
            */
            public get distance(): number;
            public set distance(value: number);
            /** Returns a copy of the plane that faces in the opposite direction.
            */
            public get flipped(): UnityEngine.Plane;
            /** Sets a plane using a point that lies within it along with a normal to orient it.
            * @param $inNormal The plane's normal vector.
            * @param $inPoint A point that lies on the plane.
            */
            public SetNormalAndPosition ($inNormal: UnityEngine.Vector3, $inPoint: UnityEngine.Vector3) : void
            /** Sets a plane using three points that lie within it.  The points go around clockwise as you look down on the top surface of the plane.
            * @param $a First point in clockwise order.
            * @param $b Second point in clockwise order.
            * @param $c Third point in clockwise order.
            */
            public Set3Points ($a: UnityEngine.Vector3, $b: UnityEngine.Vector3, $c: UnityEngine.Vector3) : void
            /** Makes the plane face in the opposite direction.
            */
            public Flip () : void
            /** Moves the plane in space by the translation vector.
            * @param $translation The offset in space to move the plane with.
            */
            public Translate ($translation: UnityEngine.Vector3) : void
            /** Returns a copy of the given plane that is moved in space by the given translation.
            * @param $plane The plane to move in space.
            * @param $translation The offset in space to move the plane with.
            * @returns The translated plane. 
            */
            public static Translate ($plane: UnityEngine.Plane, $translation: UnityEngine.Vector3) : UnityEngine.Plane
            /** For a given point returns the closest point on the plane.
            * @param $point The point to project onto the plane.
            * @returns A point on the plane that is closest to point. 
            */
            public ClosestPointOnPlane ($point: UnityEngine.Vector3) : UnityEngine.Vector3
            /** Returns a signed distance from plane to point.
            */
            public GetDistanceToPoint ($point: UnityEngine.Vector3) : number
            /** Is a point on the positive side of the plane?
            */
            public GetSide ($point: UnityEngine.Vector3) : boolean
            /** Are two points on the same side of the plane?
            */
            public SameSide ($inPt0: UnityEngine.Vector3, $inPt1: UnityEngine.Vector3) : boolean
            /** Intersects a ray with the plane.
            */
            public Raycast ($ray: UnityEngine.Ray, $enter: $Ref<number>) : boolean
            public ToString () : string
            public ToString ($format: string) : string
            public ToString ($format: string, $formatProvider: System.IFormatProvider) : string
            public constructor ($inNormal: UnityEngine.Vector3, $inPoint: UnityEngine.Vector3)
            public constructor ($inNormal: UnityEngine.Vector3, $d: number)
            public constructor ($a: UnityEngine.Vector3, $b: UnityEngine.Vector3, $c: UnityEngine.Vector3)
        }
        /** Specifies Layers to use in a Physics.Raycast.
        */
        class LayerMask extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            /** Converts a layer mask value to an integer value.
            */
            public get value(): number;
            public set value(value: number);
            public static op_Implicit ($mask: UnityEngine.LayerMask) : number
            public static op_Implicit ($intVal: number) : UnityEngine.LayerMask
            /** Given a layer number, returns the name of the layer as defined in either a Builtin or a User Layer in the.
            */
            public static LayerToName ($layer: number) : string
            /** Given a layer name, returns the layer index as defined by either a Builtin or a User Layer in the.
            */
            public static NameToLayer ($layerName: string) : number
            /** Given a set of layer names as defined by either a Builtin or a User Layer in the, returns the equivalent layer mask for all of them.
            * @param $layerNames List of layer names to convert to a layer mask.
            * @returns The layer mask created from the layerNames. 
            */
            public static GetMask (...layerNames: string[]) : number
        }
        interface ISerializationCallbackReceiver
        {
        }
        /** A class you can derive from if you want to create objects that live independently of GameObjects.
        */
        class ScriptableObject extends UnityEngine.Object
        {
            protected [__keep_incompatibility]: never;
        }
        /** Representation of RGBA colors in 32 bit format.
        */
        class Color32 extends System.ValueType implements System.IFormattable, System.IEquatable$1<UnityEngine.Color32>
        {
            protected [__keep_incompatibility]: never;
            /** Red component of the color.
            */
            public r : number
            /** Green component of the color.
            */
            public g : number
            /** Blue component of the color.
            */
            public b : number
            /** Alpha component of the color.
            */
            public a : number
            public static op_Implicit ($c: UnityEngine.Color) : UnityEngine.Color32
            public static op_Implicit ($c: UnityEngine.Color32) : UnityEngine.Color
            /** Linearly interpolates between colors a and b by t.
            */
            public static Lerp ($a: UnityEngine.Color32, $b: UnityEngine.Color32, $t: number) : UnityEngine.Color32
            /** Linearly interpolates between colors a and b by t.
            */
            public static LerpUnclamped ($a: UnityEngine.Color32, $b: UnityEngine.Color32, $t: number) : UnityEngine.Color32
            public get_Item ($index: number) : number
            public set_Item ($index: number, $value: number) : void
            public Equals ($other: any) : boolean
            public Equals ($other: UnityEngine.Color32) : boolean
            /** Returns a formatted string for this color.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString () : string
            /** Returns a formatted string for this color.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string) : string
            /** Returns a formatted string for this color.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string, $formatProvider: System.IFormatProvider) : string
            public constructor ($r: number, $g: number, $b: number, $a: number)
        }
        /** A 2D Rectangle defined by X and Y position, width and height.
        */
        class Rect extends System.ValueType implements System.IFormattable, System.IEquatable$1<UnityEngine.Rect>
        {
            protected [__keep_incompatibility]: never;
            /** Shorthand for writing new Rect(0,0,0,0).
            */
            public static get zero(): UnityEngine.Rect;
            /** The X coordinate of the rectangle.
            */
            public get x(): number;
            public set x(value: number);
            /** The Y coordinate of the rectangle.
            */
            public get y(): number;
            public set y(value: number);
            /** The X and Y position of the rectangle.
            */
            public get position(): UnityEngine.Vector2;
            public set position(value: UnityEngine.Vector2);
            /** The position of the center of the rectangle.
            */
            public get center(): UnityEngine.Vector2;
            public set center(value: UnityEngine.Vector2);
            /** The position of the minimum corner of the rectangle.
            */
            public get min(): UnityEngine.Vector2;
            public set min(value: UnityEngine.Vector2);
            /** The position of the maximum corner of the rectangle.
            */
            public get max(): UnityEngine.Vector2;
            public set max(value: UnityEngine.Vector2);
            /** The width of the rectangle, measured from the X position.
            */
            public get width(): number;
            public set width(value: number);
            /** The height of the rectangle, measured from the Y position.
            */
            public get height(): number;
            public set height(value: number);
            /** The width and height of the rectangle.
            */
            public get size(): UnityEngine.Vector2;
            public set size(value: UnityEngine.Vector2);
            /** The minimum X coordinate of the rectangle.
            */
            public get xMin(): number;
            public set xMin(value: number);
            /** The minimum Y coordinate of the rectangle.
            */
            public get yMin(): number;
            public set yMin(value: number);
            /** The maximum X coordinate of the rectangle.
            */
            public get xMax(): number;
            public set xMax(value: number);
            /** The maximum Y coordinate of the rectangle.
            */
            public get yMax(): number;
            public set yMax(value: number);
            /** Creates a rectangle from min/max coordinate values.
            * @param $xmin The minimum X coordinate.
            * @param $ymin The minimum Y coordinate.
            * @param $xmax The maximum X coordinate.
            * @param $ymax The maximum Y coordinate.
            * @returns A rectangle matching the specified coordinates. 
            */
            public static MinMaxRect ($xmin: number, $ymin: number, $xmax: number, $ymax: number) : UnityEngine.Rect
            /** Set components of an existing Rect.
            */
            public Set ($x: number, $y: number, $width: number, $height: number) : void
            /** Returns true if the x and y components of point is a point inside this rectangle. If allowInverse is present and true, the width and height of the Rect are allowed to take negative values (ie, the min value is greater than the max), and the test will still work.
            * @param $point Point to test.
            * @param $allowInverse Does the test allow the Rect's width and height to be negative?
            * @returns True if the point lies within the specified rectangle. 
            */
            public Contains ($point: UnityEngine.Vector2) : boolean
            /** Returns true if the x and y components of point is a point inside this rectangle. If allowInverse is present and true, the width and height of the Rect are allowed to take negative values (ie, the min value is greater than the max), and the test will still work.
            * @param $point Point to test.
            * @param $allowInverse Does the test allow the Rect's width and height to be negative?
            * @returns True if the point lies within the specified rectangle. 
            */
            public Contains ($point: UnityEngine.Vector3) : boolean
            /** Returns true if the x and y components of point is a point inside this rectangle. If allowInverse is present and true, the width and height of the Rect are allowed to take negative values (ie, the min value is greater than the max), and the test will still work.
            * @param $point Point to test.
            * @param $allowInverse Does the test allow the Rect's width and height to be negative?
            * @returns True if the point lies within the specified rectangle. 
            */
            public Contains ($point: UnityEngine.Vector3, $allowInverse: boolean) : boolean
            /** Returns true if the other rectangle overlaps this one. If allowInverse is present and true, the widths and heights of the Rects are allowed to take negative values (ie, the min value is greater than the max), and the test will still work.
            * @param $other Other rectangle to test overlapping with.
            * @param $allowInverse Does the test allow the widths and heights of the Rects to be negative?
            */
            public Overlaps ($other: UnityEngine.Rect) : boolean
            /** Returns true if the other rectangle overlaps this one. If allowInverse is present and true, the widths and heights of the Rects are allowed to take negative values (ie, the min value is greater than the max), and the test will still work.
            * @param $other Other rectangle to test overlapping with.
            * @param $allowInverse Does the test allow the widths and heights of the Rects to be negative?
            */
            public Overlaps ($other: UnityEngine.Rect, $allowInverse: boolean) : boolean
            /** Returns a point inside a rectangle, given normalized coordinates.
            * @param $rectangle Rectangle to get a point inside.
            * @param $normalizedRectCoordinates Normalized coordinates to get a point for.
            */
            public static NormalizedToPoint ($rectangle: UnityEngine.Rect, $normalizedRectCoordinates: UnityEngine.Vector2) : UnityEngine.Vector2
            /** Returns the normalized coordinates cooresponding the the point.
            * @param $rectangle Rectangle to get normalized coordinates inside.
            * @param $point A point inside the rectangle to get normalized coordinates for.
            */
            public static PointToNormalized ($rectangle: UnityEngine.Rect, $point: UnityEngine.Vector2) : UnityEngine.Vector2
            public static op_Inequality ($lhs: UnityEngine.Rect, $rhs: UnityEngine.Rect) : boolean
            public static op_Equality ($lhs: UnityEngine.Rect, $rhs: UnityEngine.Rect) : boolean
            public Equals ($other: any) : boolean
            public Equals ($other: UnityEngine.Rect) : boolean
            /** Returns a formatted string for this Rect.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString () : string
            /** Returns a formatted string for this Rect.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string) : string
            /** Returns a formatted string for this Rect.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string, $formatProvider: System.IFormatProvider) : string
            public constructor ($x: number, $y: number, $width: number, $height: number)
            public constructor ($position: UnityEngine.Vector2, $size: UnityEngine.Vector2)
            public constructor ($source: UnityEngine.Rect)
        }
        /** A 2D Rectangle defined by x, y, width, height with integers.
        */
        class RectInt extends System.ValueType implements System.IFormattable, System.IEquatable$1<UnityEngine.RectInt>
        {
            protected [__keep_incompatibility]: never;
            /** Left coordinate of the rectangle.
            */
            public get x(): number;
            public set x(value: number);
            /** Top coordinate of the rectangle.
            */
            public get y(): number;
            public set y(value: number);
            /** Center coordinate of the rectangle.
            */
            public get center(): UnityEngine.Vector2;
            /** The lower left corner of the rectangle; which is the minimal position of the rectangle along the x- and y-axes, when it is aligned to both axes.
            */
            public get min(): UnityEngine.Vector2Int;
            public set min(value: UnityEngine.Vector2Int);
            /** The upper right corner of the rectangle; which is the maximal position of the rectangle along the x- and y-axes, when it is aligned to both axes.
            */
            public get max(): UnityEngine.Vector2Int;
            public set max(value: UnityEngine.Vector2Int);
            /** Width of the rectangle.
            */
            public get width(): number;
            public set width(value: number);
            /** Height of the rectangle.
            */
            public get height(): number;
            public set height(value: number);
            /** Shows the minimum X value of the RectInt.
            */
            public get xMin(): number;
            public set xMin(value: number);
            /** Show the minimum Y value of the RectInt.
            */
            public get yMin(): number;
            public set yMin(value: number);
            /** Shows the maximum X value of the RectInt.
            */
            public get xMax(): number;
            public set xMax(value: number);
            /** Shows the maximum Y value of the RectInt.
            */
            public get yMax(): number;
            public set yMax(value: number);
            /** Returns the position (x, y) of the RectInt.
            */
            public get position(): UnityEngine.Vector2Int;
            public set position(value: UnityEngine.Vector2Int);
            /** Returns the width and height of the RectInt.
            */
            public get size(): UnityEngine.Vector2Int;
            public set size(value: UnityEngine.Vector2Int);
            /** Shorthand for writing new RectInt(0,0,0,0).
            */
            public static get zero(): UnityEngine.RectInt;
            /** A RectInt.PositionCollection that contains all positions within the RectInt.
            */
            public get allPositionsWithin(): UnityEngine.RectInt.PositionEnumerator;
            /** Sets the bounds to the min and max value of the rect.
            */
            public SetMinMax ($minPosition: UnityEngine.Vector2Int, $maxPosition: UnityEngine.Vector2Int) : void
            /** Clamps the position and size of the RectInt to the given bounds.
            * @param $bounds Bounds to clamp the RectInt.
            */
            public ClampToBounds ($bounds: UnityEngine.RectInt) : void
            /** Returns true if the given position is within the RectInt.
            * @param $position Position to check.
            * @returns Whether the position is within the RectInt. 
            */
            public Contains ($position: UnityEngine.Vector2Int) : boolean
            /** RectInts overlap if each RectInt Contains a shared point.
            * @param $other Other rectangle to test overlapping with.
            * @returns True if the other rectangle overlaps this one. 
            */
            public Overlaps ($other: UnityEngine.RectInt) : boolean
            /** Returns the x, y, width and height of the RectInt.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString () : string
            /** Returns the x, y, width and height of the RectInt.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string) : string
            /** Returns the x, y, width and height of the RectInt.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string, $formatProvider: System.IFormatProvider) : string
            public static op_Inequality ($lhs: UnityEngine.RectInt, $rhs: UnityEngine.RectInt) : boolean
            public static op_Equality ($lhs: UnityEngine.RectInt, $rhs: UnityEngine.RectInt) : boolean
            public Equals ($other: any) : boolean
            /** Returns true if the given RectInt is equal to this RectInt.
            */
            public Equals ($other: UnityEngine.RectInt) : boolean
            public constructor ($xMin: number, $yMin: number, $width: number, $height: number)
            public constructor ($position: UnityEngine.Vector2Int, $size: UnityEngine.Vector2Int)
        }
        /** Represents an axis aligned bounding box.
        */
        class Bounds extends System.ValueType implements System.IFormattable, System.IEquatable$1<UnityEngine.Bounds>
        {
            protected [__keep_incompatibility]: never;
            /** The center of the bounding box.
            */
            public get center(): UnityEngine.Vector3;
            public set center(value: UnityEngine.Vector3);
            /** The total size of the box. This is always twice as large as the extents.
            */
            public get size(): UnityEngine.Vector3;
            public set size(value: UnityEngine.Vector3);
            /** The extents of the Bounding Box. This is always half of the size of the Bounds.
            */
            public get extents(): UnityEngine.Vector3;
            public set extents(value: UnityEngine.Vector3);
            /** The minimal point of the box. This is always equal to center-extents.
            */
            public get min(): UnityEngine.Vector3;
            public set min(value: UnityEngine.Vector3);
            /** The maximal point of the box. This is always equal to center+extents.
            */
            public get max(): UnityEngine.Vector3;
            public set max(value: UnityEngine.Vector3);
            public Equals ($other: any) : boolean
            public Equals ($other: UnityEngine.Bounds) : boolean
            public static op_Equality ($lhs: UnityEngine.Bounds, $rhs: UnityEngine.Bounds) : boolean
            public static op_Inequality ($lhs: UnityEngine.Bounds, $rhs: UnityEngine.Bounds) : boolean
            /** Sets the bounds to the min and max value of the box.
            */
            public SetMinMax ($min: UnityEngine.Vector3, $max: UnityEngine.Vector3) : void
            /** Grows the Bounds to include the point.
            */
            public Encapsulate ($point: UnityEngine.Vector3) : void
            /** Grow the bounds to encapsulate the bounds.
            */
            public Encapsulate ($bounds: UnityEngine.Bounds) : void
            /** Expand the bounds by increasing its size by amount along each side.
            */
            public Expand ($amount: number) : void
            /** Expand the bounds by increasing its size by amount along each side.
            */
            public Expand ($amount: UnityEngine.Vector3) : void
            /** Does another bounding box intersect with this bounding box?
            */
            public Intersects ($bounds: UnityEngine.Bounds) : boolean
            /** Does ray intersect this bounding box?
            */
            public IntersectRay ($ray: UnityEngine.Ray) : boolean
            /** Does ray intersect this bounding box?
            */
            public IntersectRay ($ray: UnityEngine.Ray, $distance: $Ref<number>) : boolean
            /** Returns a formatted string for the bounds.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString () : string
            /** Returns a formatted string for the bounds.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string) : string
            /** Returns a formatted string for the bounds.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string, $formatProvider: System.IFormatProvider) : string
            /** Is point contained in the bounding box?
            */
            public Contains ($point: UnityEngine.Vector3) : boolean
            /** The smallest squared distance between the point and this bounding box.
            */
            public SqrDistance ($point: UnityEngine.Vector3) : number
            /** The closest point on the bounding box.
            * @param $point Arbitrary point.
            * @returns The point on the bounding box or inside the bounding box. 
            */
            public ClosestPoint ($point: UnityEngine.Vector3) : UnityEngine.Vector3
            public constructor ($center: UnityEngine.Vector3, $size: UnityEngine.Vector3)
        }
        /** Representation of rays.
        */
        class Ray extends System.ValueType implements System.IFormattable
        {
            protected [__keep_incompatibility]: never;
            /** The origin point of the ray.
            */
            public get origin(): UnityEngine.Vector3;
            public set origin(value: UnityEngine.Vector3);
            /** The direction of the ray.
            */
            public get direction(): UnityEngine.Vector3;
            public set direction(value: UnityEngine.Vector3);
            /** Returns a point at distance units along the ray.
            */
            public GetPoint ($distance: number) : UnityEngine.Vector3
            /** Returns a formatted string for this ray.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString () : string
            /** Returns a formatted string for this ray.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string) : string
            /** Returns a formatted string for this ray.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string, $formatProvider: System.IFormatProvider) : string
            public constructor ($origin: UnityEngine.Vector3, $direction: UnityEngine.Vector3)
        }
        /** Represents an axis aligned bounding box with all values as integers.
        */
        class BoundsInt extends System.ValueType implements System.IFormattable, System.IEquatable$1<UnityEngine.BoundsInt>
        {
            protected [__keep_incompatibility]: never;
            /** X value of the minimal point of the box.
            */
            public get x(): number;
            public set x(value: number);
            /** Y value of the minimal point of the box.
            */
            public get y(): number;
            public set y(value: number);
            /** Z value of the minimal point of the box.
            */
            public get z(): number;
            public set z(value: number);
            /** The center of the bounding box.
            */
            public get center(): UnityEngine.Vector3;
            /** The minimal point of the box.
            */
            public get min(): UnityEngine.Vector3Int;
            public set min(value: UnityEngine.Vector3Int);
            /** The maximal point of the box.
            */
            public get max(): UnityEngine.Vector3Int;
            public set max(value: UnityEngine.Vector3Int);
            /** The minimal x point of the box.
            */
            public get xMin(): number;
            public set xMin(value: number);
            /** The minimal y point of the box.
            */
            public get yMin(): number;
            public set yMin(value: number);
            /** The minimal z point of the box.
            */
            public get zMin(): number;
            public set zMin(value: number);
            /** The maximal x point of the box.
            */
            public get xMax(): number;
            public set xMax(value: number);
            /** The maximal y point of the box.
            */
            public get yMax(): number;
            public set yMax(value: number);
            /** The maximal z point of the box.
            */
            public get zMax(): number;
            public set zMax(value: number);
            /** The position of the bounding box.
            */
            public get position(): UnityEngine.Vector3Int;
            public set position(value: UnityEngine.Vector3Int);
            /** The total size of the box.
            */
            public get size(): UnityEngine.Vector3Int;
            public set size(value: UnityEngine.Vector3Int);
            /** A BoundsInt.PositionCollection that contains all positions within the BoundsInt.
            */
            public get allPositionsWithin(): UnityEngine.BoundsInt.PositionEnumerator;
            /** Sets the bounds to the min and max value of the box.
            */
            public SetMinMax ($minPosition: UnityEngine.Vector3Int, $maxPosition: UnityEngine.Vector3Int) : void
            /** Clamps the position and size of this bounding box to the given bounds.
            * @param $bounds Bounds to clamp to.
            */
            public ClampToBounds ($bounds: UnityEngine.BoundsInt) : void
            /** Is point contained in the bounding box?
            * @param $position Point to check.
            * @returns Is point contained in the bounding box? 
            */
            public Contains ($position: UnityEngine.Vector3Int) : boolean
            /** Returns a formatted string for the bounds.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString () : string
            /** Returns a formatted string for the bounds.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string) : string
            /** Returns a formatted string for the bounds.
            * @param $format A numeric format string.
            * @param $formatProvider An object that specifies culture-specific formatting.
            */
            public ToString ($format: string, $formatProvider: System.IFormatProvider) : string
            public static op_Equality ($lhs: UnityEngine.BoundsInt, $rhs: UnityEngine.BoundsInt) : boolean
            public static op_Inequality ($lhs: UnityEngine.BoundsInt, $rhs: UnityEngine.BoundsInt) : boolean
            public Equals ($other: any) : boolean
            public Equals ($other: UnityEngine.BoundsInt) : boolean
            public constructor ($xMin: number, $yMin: number, $zMin: number, $sizeX: number, $sizeY: number, $sizeZ: number)
            public constructor ($position: UnityEngine.Vector3Int, $size: UnityEngine.Vector3Int)
        }
        /** Store a collection of Keyframes that can be evaluated over time.
        */
        class AnimationCurve extends System.Object implements System.IEquatable$1<UnityEngine.AnimationCurve>
        {
            protected [__keep_incompatibility]: never;
            /** All keys defined in the animation curve.
            */
            public get keys(): System.Array$1<UnityEngine.Keyframe>;
            public set keys(value: System.Array$1<UnityEngine.Keyframe>);
            /** The number of keys in the curve. (Read Only)
            */
            public get length(): number;
            /** The behaviour of the animation before the first keyframe.
            */
            public get preWrapMode(): UnityEngine.WrapMode;
            public set preWrapMode(value: UnityEngine.WrapMode);
            /** The behaviour of the animation after the last keyframe.
            */
            public get postWrapMode(): UnityEngine.WrapMode;
            public set postWrapMode(value: UnityEngine.WrapMode);
            /** Evaluate the curve at time.
            * @param $time The time within the curve you want to evaluate (the horizontal axis in the curve graph).
            * @returns The value of the curve, at the point in time specified. 
            */
            public Evaluate ($time: number) : number
            /** Add a new key to the curve.
            * @param $time The time at which to add the key (horizontal axis in the curve graph).
            * @param $value The value for the key (vertical axis in the curve graph).
            * @returns The index of the added key, or -1 if the key could not be added. 
            */
            public AddKey ($time: number, $value: number) : number
            /** Add a new key to the curve.
            * @param $key The key to add to the curve.
            * @returns The index of the added key, or -1 if the key could not be added. 
            */
            public AddKey ($key: UnityEngine.Keyframe) : number
            /** Moves the key at index to key.time and key.value.
            * @param $index The index of the key to move.
            * @param $key The keyframe containing the new time and value.
            * @returns The index of the keyframe after moving it. 
            */
            public MoveKey ($index: number, $key: UnityEngine.Keyframe) : number
            /** Erases all KeyFrame from this instance of the AnimationCurve.
            */
            public ClearKeys () : void
            /** Removes a key.
            * @param $index The index of the key to remove.
            */
            public RemoveKey ($index: number) : void
            public get_Item ($index: number) : UnityEngine.Keyframe
            /** Smooth the in and out tangents of the keyframe at index.
            * @param $index The index of the keyframe to be smoothed.
            * @param $weight The smoothing weight to apply to the keyframe's tangents.
            */
            public SmoothTangents ($index: number, $weight: number) : void
            /** Creates a constant "curve" starting at timeStart, ending at timeEnd, and set to the value value.
            * @param $timeStart The start time for the constant curve.
            * @param $timeEnd The end time for the constant curve.
            * @param $value The value for the constant curve.
            * @returns The constant curve created from the specified values. 
            */
            public static Constant ($timeStart: number, $timeEnd: number, $value: number) : UnityEngine.AnimationCurve
            /** A straight Line starting at timeStart, valueStart and ending at timeEnd, valueEnd.
            * @param $timeStart The start time for the linear curve.
            * @param $valueStart The start value for the linear curve.
            * @param $timeEnd The end time for the linear curve.
            * @param $valueEnd The end value for the linear curve.
            * @returns The linear curve created from the specified values. 
            */
            public static Linear ($timeStart: number, $valueStart: number, $timeEnd: number, $valueEnd: number) : UnityEngine.AnimationCurve
            /** Creates an ease-in and out curve starting at timeStart, valueStart and ending at timeEnd, valueEnd.
            * @param $timeStart The start time for the ease curve.
            * @param $valueStart The start value for the ease curve.
            * @param $timeEnd The end time for the ease curve.
            * @param $valueEnd The end value for the ease curve.
            * @returns The ease-in and out curve generated from the specified values. 
            */
            public static EaseInOut ($timeStart: number, $valueStart: number, $timeEnd: number, $valueEnd: number) : UnityEngine.AnimationCurve
            public Equals ($o: any) : boolean
            public Equals ($other: UnityEngine.AnimationCurve) : boolean
            /** Copies the keys and properties of the specified AnimationCurve object into this instance of the  AnimationCurve class.
            * @param $other The AnimationCurve object to obtain the values to copy.
            */
            public CopyFrom ($other: UnityEngine.AnimationCurve) : void
            public constructor (...keys: UnityEngine.Keyframe[])
            public constructor ()
        }
        /** A single keyframe that can be injected into an animation curve.
        */
        class Keyframe extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            /** The time of the keyframe.
            */
            public get time(): number;
            public set time(value: number);
            /** The value of the curve at keyframe.
            */
            public get value(): number;
            public set value(value: number);
            /** Sets the incoming tangent for this key. The incoming tangent affects the slope of the curve from the previous key to this key.
            */
            public get inTangent(): number;
            public set inTangent(value: number);
            /** Sets the outgoing tangent for this key. The outgoing tangent affects the slope of the curve from this key to the next key.
            */
            public get outTangent(): number;
            public set outTangent(value: number);
            /** Sets the incoming weight for this key. The incoming weight affects the slope of the curve from the previous key to this key.
            */
            public get inWeight(): number;
            public set inWeight(value: number);
            /** Sets the outgoing weight for this key. The outgoing weight affects the slope of the curve from this key to the next key.
            */
            public get outWeight(): number;
            public set outWeight(value: number);
            /** Weighted mode for the keyframe.
            */
            public get weightedMode(): UnityEngine.WeightedMode;
            public set weightedMode(value: UnityEngine.WeightedMode);
            public constructor ($time: number, $value: number)
            public constructor ($time: number, $value: number, $inTangent: number, $outTangent: number)
            public constructor ($time: number, $value: number, $inTangent: number, $outTangent: number, $inWeight: number, $outWeight: number)
        }
        /** Determines how time is treated outside of the keyframed range of an AnimationClip or AnimationCurve.
        */
        enum WrapMode
        { Once = 1, Loop = 2, PingPong = 4, Default = 0, ClampForever = 8, Clamp = 1 }
        /** Sets which weights to use when calculating curve segments.
        */
        enum WeightedMode
        { None = 0, In = 1, Out = 2, Both = 3 }
        /** Base class for all yield instructions.
        */
        class YieldInstruction extends System.Object
        {
            protected [__keep_incompatibility]: never;
        }
        /** Asynchronous operation coroutine.
        */
        class AsyncOperation extends UnityEngine.YieldInstruction
        {
            protected [__keep_incompatibility]: never;
        }
        /** Asynchronous instantiate operation on UnityEngine.Object type.
        */
        class AsyncInstantiateOperation extends UnityEngine.AsyncOperation
        {
            protected [__keep_incompatibility]: never;
        }
        class AsyncInstantiateOperation$1<T> extends UnityEngine.AsyncInstantiateOperation
        {
            protected [__keep_incompatibility]: never;
        }
        /** Parameters for Object.Instantiate and Object.InstantiateAsync.
        */
        class InstantiateParameters extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        /** Options to specify if and how to sort objects returned by a function.
        */
        enum FindObjectsSortMode
        { None = 0, InstanceID = 1 }
        /** Options to control whether object find functions return inactive objects.
        */
        enum FindObjectsInactive
        { Exclude = 0, Include = 1 }
        /** Bit mask that controls object destruction, saving and visibility in inspectors.
        */
        enum HideFlags
        { None = 0, HideInHierarchy = 1, HideInInspector = 2, DontSaveInEditor = 4, NotEditable = 8, DontSaveInBuild = 16, DontUnloadUnusedAsset = 32, DontSave = 52, HideAndDontSave = 61 }
        /** A handle to one of the tag values that can be applied to a GameObject.
        */
        class TagHandle extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        /** Options for how to send a message.
        */
        enum SendMessageOptions
        { RequireReceiver = 0, DontRequireReceiver = 1 }
        /** MonoBehaviour.StartCoroutine returns a Coroutine. Instances of this class are only used to reference these coroutines, and do not hold any exposed properties or functions.
        */
        class Coroutine extends UnityEngine.YieldInstruction
        {
            protected [__keep_incompatibility]: never;
        }
        /** The various primitives that can be created using the GameObject.CreatePrimitive function.
        */
        enum PrimitiveType
        { Sphere = 0, Capsule = 1, Cylinder = 2, Cube = 3, Plane = 4, Quad = 5 }
        /** The coordinate spaces in which to apply transformation to a GameObject.
        */
        enum Space
        { World = 0, Self = 1 }
        /** Class containing methods to ease debugging while developing a game.
        */
        class Debug extends System.Object
        {
            protected [__keep_incompatibility]: never;
            /** Get default debug logger.
            */
            public static get unityLogger(): UnityEngine.ILogger;
            /** Allows you to enable or disable the developer console.
            */
            public static get developerConsoleEnabled(): boolean;
            public static set developerConsoleEnabled(value: boolean);
            /** Controls whether the development console is visible.
            */
            public static get developerConsoleVisible(): boolean;
            public static set developerConsoleVisible(value: boolean);
            /** In the Build Settings dialog there is a check box called "Development Build".
            */
            public static get isDebugBuild(): boolean;
            /** Draws a line between specified start and end points.
            * @param $start Point in world space where the line should start.
            * @param $end Point in world space where the line should end.
            * @param $color Color of the line.
            * @param $duration How long the line should be visible for.
            * @param $depthTest Determines whether objects closer to the camera obscure the line.
            */
            public static DrawLine ($start: UnityEngine.Vector3, $end: UnityEngine.Vector3, $color: UnityEngine.Color, $duration: number) : void
            /** Draws a line between specified start and end points.
            * @param $start Point in world space where the line should start.
            * @param $end Point in world space where the line should end.
            * @param $color Color of the line.
            * @param $duration How long the line should be visible for.
            * @param $depthTest Determines whether objects closer to the camera obscure the line.
            */
            public static DrawLine ($start: UnityEngine.Vector3, $end: UnityEngine.Vector3, $color: UnityEngine.Color) : void
            /** Draws a line between specified start and end points.
            * @param $start Point in world space where the line should start.
            * @param $end Point in world space where the line should end.
            * @param $color Color of the line.
            * @param $duration How long the line should be visible for.
            * @param $depthTest Determines whether objects closer to the camera obscure the line.
            */
            public static DrawLine ($start: UnityEngine.Vector3, $end: UnityEngine.Vector3) : void
            /** Draws a line between specified start and end points.
            * @param $start Point in world space where the line should start.
            * @param $end Point in world space where the line should end.
            * @param $color Color of the line.
            * @param $duration How long the line should be visible for.
            * @param $depthTest Determines whether objects closer to the camera obscure the line.
            */
            public static DrawLine ($start: UnityEngine.Vector3, $end: UnityEngine.Vector3, $color: UnityEngine.Color, $duration: number, $depthTest: boolean) : void
            /** Draws a line from start to start + dir in world coordinates.
            * @param $start Point in world space where the ray should start.
            * @param $dir Direction and length of the ray.
            * @param $color Color of the drawn line.
            * @param $duration How long the line will be visible for (in seconds).
            * @param $depthTest Determines whether objects closer to the camera obscure the line.
            */
            public static DrawRay ($start: UnityEngine.Vector3, $dir: UnityEngine.Vector3, $color: UnityEngine.Color, $duration: number) : void
            /** Draws a line from start to start + dir in world coordinates.
            * @param $start Point in world space where the ray should start.
            * @param $dir Direction and length of the ray.
            * @param $color Color of the drawn line.
            * @param $duration How long the line will be visible for (in seconds).
            * @param $depthTest Determines whether objects closer to the camera obscure the line.
            */
            public static DrawRay ($start: UnityEngine.Vector3, $dir: UnityEngine.Vector3, $color: UnityEngine.Color) : void
            /** Draws a line from start to start + dir in world coordinates.
            * @param $start Point in world space where the ray should start.
            * @param $dir Direction and length of the ray.
            * @param $color Color of the drawn line.
            * @param $duration How long the line will be visible for (in seconds).
            * @param $depthTest Determines whether objects closer to the camera obscure the line.
            */
            public static DrawRay ($start: UnityEngine.Vector3, $dir: UnityEngine.Vector3) : void
            /** Draws a line from start to start + dir in world coordinates.
            * @param $start Point in world space where the ray should start.
            * @param $dir Direction and length of the ray.
            * @param $color Color of the drawn line.
            * @param $duration How long the line will be visible for (in seconds).
            * @param $depthTest Determines whether objects closer to the camera obscure the line.
            */
            public static DrawRay ($start: UnityEngine.Vector3, $dir: UnityEngine.Vector3, $color: UnityEngine.Color, $duration: number, $depthTest: boolean) : void
            /** Pauses the editor.
            */
            public static Break () : void
            public static DebugBreak () : void
            /** Logs a message to the Unity Console.
            * @param $message String or object to be converted to string representation for display.
            * @param $context Object to which the message applies.
            */
            public static Log ($message: any) : void
            /** Logs a message to the Unity Console.
            * @param $message String or object to be converted to string representation for display.
            * @param $context Object to which the message applies.
            */
            public static Log ($message: any, $context: UnityEngine.Object) : void
            /** Logs a formatted message to the Unity Console.
            * @param $format A composite format string.
            * @param $args Format arguments.
            * @param $context Object to which the message applies.
            * @param $logType Type of message e.g. warn or error etc.
            * @param $logOptions Option flags to treat the log message special.
            */
            public static LogFormat ($format: string, ...args: any[]) : void
            /** Logs a formatted message to the Unity Console.
            * @param $format A composite format string.
            * @param $args Format arguments.
            * @param $context Object to which the message applies.
            * @param $logType Type of message e.g. warn or error etc.
            * @param $logOptions Option flags to treat the log message special.
            */
            public static LogFormat ($context: UnityEngine.Object, $format: string, ...args: any[]) : void
            /** Logs a formatted message to the Unity Console.
            * @param $format A composite format string.
            * @param $args Format arguments.
            * @param $context Object to which the message applies.
            * @param $logType Type of message e.g. warn or error etc.
            * @param $logOptions Option flags to treat the log message special.
            */
            public static LogFormat ($logType: UnityEngine.LogType, $logOptions: UnityEngine.LogOption, $context: UnityEngine.Object, $format: string, ...args: any[]) : void
            /** A variant of Debug.Log that logs an error message to the console.
            * @param $message String or object to be converted to string representation for display.
            * @param $context Object to which the message applies.
            */
            public static LogError ($message: any) : void
            /** A variant of Debug.Log that logs an error message to the console.
            * @param $message String or object to be converted to string representation for display.
            * @param $context Object to which the message applies.
            */
            public static LogError ($message: any, $context: UnityEngine.Object) : void
            /** Logs a formatted error message to the Unity console.
            * @param $format A composite format string.
            * @param $args Format arguments.
            * @param $context Object to which the message applies.
            */
            public static LogErrorFormat ($format: string, ...args: any[]) : void
            /** Logs a formatted error message to the Unity console.
            * @param $format A composite format string.
            * @param $args Format arguments.
            * @param $context Object to which the message applies.
            */
            public static LogErrorFormat ($context: UnityEngine.Object, $format: string, ...args: any[]) : void
            /** Clears errors from the developer console.
            */
            public static ClearDeveloperConsole () : void
            /** A variant of Debug.Log that logs an error message to the console.
            * @param $context Object to which the message applies.
            * @param $exception Runtime Exception.
            */
            public static LogException ($exception: System.Exception) : void
            /** A variant of Debug.Log that logs an error message to the console.
            * @param $context Object to which the message applies.
            * @param $exception Runtime Exception.
            */
            public static LogException ($exception: System.Exception, $context: UnityEngine.Object) : void
            /** A variant of Debug.Log that logs a warning message to the console.
            * @param $message String or object to be converted to string representation for display.
            * @param $context Object to which the message applies.
            */
            public static LogWarning ($message: any) : void
            /** A variant of Debug.Log that logs a warning message to the console.
            * @param $message String or object to be converted to string representation for display.
            * @param $context Object to which the message applies.
            */
            public static LogWarning ($message: any, $context: UnityEngine.Object) : void
            /** Logs a formatted warning message to the Unity Console.
            * @param $format A composite format string.
            * @param $args Format arguments.
            * @param $context Object to which the message applies.
            */
            public static LogWarningFormat ($format: string, ...args: any[]) : void
            /** Logs a formatted warning message to the Unity Console.
            * @param $format A composite format string.
            * @param $args Format arguments.
            * @param $context Object to which the message applies.
            */
            public static LogWarningFormat ($context: UnityEngine.Object, $format: string, ...args: any[]) : void
            /** Assert a condition and logs an error message to the Unity console on failure.
            * @param $condition Condition you expect to be true.
            * @param $context Object to which the message applies.
            * @param $message String or object to be converted to string representation for display.
            */
            public static Assert ($condition: boolean) : void
            /** Assert a condition and logs an error message to the Unity console on failure.
            * @param $condition Condition you expect to be true.
            * @param $context Object to which the message applies.
            * @param $message String or object to be converted to string representation for display.
            */
            public static Assert ($condition: boolean, $context: UnityEngine.Object) : void
            /** Assert a condition and logs an error message to the Unity console on failure.
            * @param $condition Condition you expect to be true.
            * @param $context Object to which the message applies.
            * @param $message String or object to be converted to string representation for display.
            */
            public static Assert ($condition: boolean, $message: any) : void
            public static Assert ($condition: boolean, $message: string) : void
            /** Assert a condition and logs an error message to the Unity console on failure.
            * @param $condition Condition you expect to be true.
            * @param $context Object to which the message applies.
            * @param $message String or object to be converted to string representation for display.
            */
            public static Assert ($condition: boolean, $message: any, $context: UnityEngine.Object) : void
            public static Assert ($condition: boolean, $message: string, $context: UnityEngine.Object) : void
            /** Assert a condition and logs a formatted error message to the Unity console on failure.
            * @param $condition Condition you expect to be true.
            * @param $format A composite format string.
            * @param $args Format arguments.
            * @param $context Object to which the message applies.
            */
            public static AssertFormat ($condition: boolean, $format: string, ...args: any[]) : void
            /** Assert a condition and logs a formatted error message to the Unity console on failure.
            * @param $condition Condition you expect to be true.
            * @param $format A composite format string.
            * @param $args Format arguments.
            * @param $context Object to which the message applies.
            */
            public static AssertFormat ($condition: boolean, $context: UnityEngine.Object, $format: string, ...args: any[]) : void
            /** A variant of Debug.Log that logs an assertion message to the console.
            * @param $message String or object to be converted to string representation for display.
            * @param $context Object to which the message applies.
            */
            public static LogAssertion ($message: any) : void
            /** A variant of Debug.Log that logs an assertion message to the console.
            * @param $message String or object to be converted to string representation for display.
            * @param $context Object to which the message applies.
            */
            public static LogAssertion ($message: any, $context: UnityEngine.Object) : void
            /** Logs a formatted assertion message to the Unity console.
            * @param $format A composite format string.
            * @param $args Format arguments.
            * @param $context Object to which the message applies.
            */
            public static LogAssertionFormat ($format: string, ...args: any[]) : void
            /** Logs a formatted assertion message to the Unity console.
            * @param $format A composite format string.
            * @param $args Format arguments.
            * @param $context Object to which the message applies.
            */
            public static LogAssertionFormat ($context: UnityEngine.Object, $format: string, ...args: any[]) : void
            /** Returns any captured startup logs
            */
            public static RetrieveStartupLogs () : System.Array$1<UnityEngine.Debug.StartupLog>
            /** Performs an integrity check of the currently running process and return discovered errors.
            * @param $level Thoroughness of integrity check.
            */
            public static CheckIntegrity ($level: UnityEngine.IntegrityCheckLevel) : string
            /** Returns whether a given validation level is currently enabled.
            * @param $level The validation level to test.
            */
            public static IsValidationLevelEnabled ($level: UnityEngine.ValidationLevel) : boolean
            public constructor ()
        }
        interface ILogger extends UnityEngine.ILogHandler
        {
        }
        interface ILogHandler
        {
        }
        /** The type of the log message in Debug.unityLogger.Log or delegate registered with Application.RegisterLogCallback.
        */
        enum LogType
        { Error = 0, Assert = 1, Warning = 2, Log = 3, Exception = 4 }
        /** Option flags for specifying special treatment of a log message.
        */
        enum LogOption
        { None = 0, NoStacktrace = 1 }
        /** 
        Enumeration specifying a integrity check level.
        Additional resources: Debug.CheckIntegrity
        */
        enum IntegrityCheckLevel
        { Low = 1, Medium = 2, High = 3 }
        /** 
        Enumeration specifying a validation level.
        Additional resources: Debug.IsValidationLevelEnabled
        */
        enum ValidationLevel
        { None = 0, Low = 1, Medium = 2, High = 3 }
        /** Provides an interface to get time information from Unity.
        */
        class Time extends System.Object
        {
            protected [__keep_incompatibility]: never;
            /** The time at the beginning of the current frame in seconds since the start of the application (Read Only).
            */
            public static get time(): number;
            /** The double precision time at the beginning of this frame (Read Only). This is the time in seconds since the start of the game.
            */
            public static get timeAsDouble(): number;
            /** The time this frame has started (Read Only). This is the time in seconds since the start of the game represented as a RationalTime.
            */
            public static get timeAsRational(): Unity.IntegerTime.RationalTime;
            /** The time in seconds since the last non-additive scene finished loading (Read Only).
            */
            public static get timeSinceLevelLoad(): number;
            /** The double precision time in seconds since the last non-additive scene finished loading (Read Only).
            */
            public static get timeSinceLevelLoadAsDouble(): number;
            /** The interval in seconds from the last frame to the current one (Read Only).
            */
            public static get deltaTime(): number;
            /** The time at which the current MonoBehaviour.FixedUpdate started in seconds since the start of the game (Read Only).
            */
            public static get fixedTime(): number;
            /** The double precision time since the last MonoBehaviour.FixedUpdate started (Read Only). This is the time in seconds since the start of the game.
            */
            public static get fixedTimeAsDouble(): number;
            /** The timeScale-independent time for this frame (Read Only). This is the time in seconds since the start of the game.
            */
            public static get unscaledTime(): number;
            /** The double precision timeScale-independent time for this frame (Read Only). This is the time in seconds since the start of the game.
            */
            public static get unscaledTimeAsDouble(): number;
            /** The timeScale-independent time at the beginning of the last MonoBehaviour.FixedUpdate phase (Read Only). This is the time in seconds since the start of the game.
            */
            public static get fixedUnscaledTime(): number;
            /** The double precision timeScale-independent time at the beginning of the last MonoBehaviour.FixedUpdate (Read Only). This is the time in seconds since the start of the game.
            */
            public static get fixedUnscaledTimeAsDouble(): number;
            /** The timeScale-independent interval in seconds from the last frame to the current one (Read Only).
            */
            public static get unscaledDeltaTime(): number;
            /** The interval in seconds of timeScale-independent ("real") time at which physics and other fixed frame rate updates (like MonoBehaviour's MonoBehaviour.FixedUpdate) are performed.(Read Only).
            */
            public static get fixedUnscaledDeltaTime(): number;
            /** The interval in seconds of in-game time at which physics and other fixed frame rate updates (like MonoBehaviour's MonoBehaviour.FixedUpdate) are performed.
            */
            public static get fixedDeltaTime(): number;
            public static set fixedDeltaTime(value: number);
            /** The maximum value of Time.deltaTime in any given frame. This is a time in seconds that limits the increase of Time.time between two frames.
            */
            public static get maximumDeltaTime(): number;
            public static set maximumDeltaTime(value: number);
            /** A smoothed out Time.deltaTime (Read Only).
            */
            public static get smoothDeltaTime(): number;
            /** The maximum time a frame can spend on particle updates. If the frame takes longer than this, then updates are split into multiple smaller updates.
            */
            public static get maximumParticleDeltaTime(): number;
            public static set maximumParticleDeltaTime(value: number);
            /** The scale at which time passes.
            */
            public static get timeScale(): number;
            public static set timeScale(value: number);
            /** The total number of frames since the start of the game (Read Only).
            */
            public static get frameCount(): number;
            public static get renderedFrameCount(): number;
            /** The real time in seconds since the game started (Read Only).
            */
            public static get realtimeSinceStartup(): number;
            /** The real time in seconds since the game started (Read Only). Double precision version of Time.realtimeSinceStartup. 
            */
            public static get realtimeSinceStartupAsDouble(): number;
            /** Slows your application’s playback time to allow Unity to save screenshots in between frames.
            */
            public static get captureDeltaTime(): number;
            public static set captureDeltaTime(value: number);
            /** Slows your application’s playback time to allow Unity to save screenshots in between frames.
            */
            public static get captureDeltaTimeRational(): Unity.IntegerTime.RationalTime;
            public static set captureDeltaTimeRational(value: Unity.IntegerTime.RationalTime);
            /** The reciprocal of Time.captureDeltaTime.
            */
            public static get captureFramerate(): number;
            public static set captureFramerate(value: number);
            /** Returns true if called inside a fixed time step callback (like MonoBehaviour's MonoBehaviour.FixedUpdate), otherwise returns false (Read Only).
            */
            public static get inFixedTimeStep(): boolean;
            public constructor ()
        }
        /** A collection of common math functions.
        */
        class Mathf extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            /** The well-known 3.14159265358979... value (Read Only).
            */
            public static PI : number
            /** A representation of positive infinity (Read Only).
            */
            public static Infinity : number
            /** A representation of negative infinity (Read Only).
            */
            public static NegativeInfinity : number
            /** Degrees-to-radians conversion constant (Read Only).
            */
            public static Deg2Rad : number
            /** Radians-to-degrees conversion constant (Read Only).
            */
            public static Rad2Deg : number
            /** A tiny floating point value (Read Only).
            */
            public static Epsilon : number
            /** Converts the given value from gamma (sRGB) to linear color space.
            */
            public static GammaToLinearSpace ($value: number) : number
            /** Converts the given value from linear to gamma (sRGB) color space.
            */
            public static LinearToGammaSpace ($value: number) : number
            /** Convert a color temperature in Kelvin to RGB color.
            * @param $kelvin Temperature in Kelvin. Range 1000 to 40000 Kelvin.
            * @returns Correlated Color Temperature as floating point RGB color. 
            */
            public static CorrelatedColorTemperatureToRGB ($kelvin: number) : UnityEngine.Color
            /** Encode a floating point value into a 16-bit representation.
            * @param $val The floating point value to convert.
            * @returns The converted half-precision float, stored in a 16-bit unsigned integer. 
            */
            public static FloatToHalf ($val: number) : number
            /** Convert a half precision float to a 32-bit floating point value.
            * @param $val The half precision value to convert.
            * @returns The decoded 32-bit float. 
            */
            public static HalfToFloat ($val: number) : number
            /** Generate 2D Perlin noise.
            * @param $x X-coordinate of sample point.
            * @param $y Y-coordinate of sample point.
            * @returns Value between 0.0 and 1.0. (Return value might be slightly below 0.0 or beyond 1.0.) 
            */
            public static PerlinNoise ($x: number, $y: number) : number
            /** Generates a 1D pseudo-random pattern of float values across a 2D plane.
            * @param $x The X-coordinate of the given sample point.
            * @returns A value in the range of 0.0 and 1.0. The value might be slightly higher or lower than this range. 
            */
            public static PerlinNoise1D ($x: number) : number
            /** Returns the sine of angle f.
            * @param $f The input angle, in radians.
            * @returns The return value between -1 and +1. 
            */
            public static Sin ($f: number) : number
            /** Returns the cosine of angle f.
            * @param $f The input angle, in radians.
            * @returns The return value between -1 and 1. 
            */
            public static Cos ($f: number) : number
            /** Returns the tangent of angle f in radians.
            */
            public static Tan ($f: number) : number
            /** Returns the arc-sine of f - the angle in radians whose sine is f.
            */
            public static Asin ($f: number) : number
            /** Returns the arc-cosine of f - the angle in radians whose cosine is f.
            */
            public static Acos ($f: number) : number
            /** Returns the arc-tangent of f - the angle in radians whose tangent is f.
            */
            public static Atan ($f: number) : number
            /** Returns the angle in radians whose Tan is y/x.
            */
            public static Atan2 ($y: number, $x: number) : number
            /** Returns square root of f.
            */
            public static Sqrt ($f: number) : number
            /** Returns the absolute value of f.
            */
            public static Abs ($f: number) : number
            /** Returns the absolute value of value.
            */
            public static Abs ($value: number) : number
            /** Returns the smallest of two or more values.
            */
            public static Min ($a: number, $b: number) : number
            /** Returns the smallest of two or more values.
            */
            public static Min (...values: number[]) : number
            /** Returns the largest of two or more values. When comparing negative values, values closer to zero are considered larger.
            */
            public static Max ($a: number, $b: number) : number
            /** Returns the largest of two or more values. When comparing negative values, values closer to zero are considered larger.
            */
            public static Max (...values: number[]) : number
            /** Returns f raised to power p.
            */
            public static Pow ($f: number, $p: number) : number
            /** Returns e raised to the specified power.
            */
            public static Exp ($power: number) : number
            /** Returns the logarithm of a specified number in a specified base.
            */
            public static Log ($f: number, $p: number) : number
            /** Returns the natural (base e) logarithm of a specified number.
            */
            public static Log ($f: number) : number
            /** Returns the base 10 logarithm of a specified number.
            */
            public static Log10 ($f: number) : number
            /** Returns the smallest integer greater than or equal to f.
            */
            public static Ceil ($f: number) : number
            /** Returns the largest integer smaller than or equal to f.
            */
            public static Floor ($f: number) : number
            /** Returns f rounded to the nearest integer.
            */
            public static Round ($f: number) : number
            /** Returns the smallest integer greater to or equal to f.
            */
            public static CeilToInt ($f: number) : number
            /** Returns the largest integer smaller to or equal to f.
            */
            public static FloorToInt ($f: number) : number
            /** Returns f rounded to the nearest integer.
            */
            public static RoundToInt ($f: number) : number
            /** Returns the sign of f.
            */
            public static Sign ($f: number) : number
            /** Clamps the given value between the given minimum float and maximum float values.  Returns the given value if it is within the minimum and maximum range.
            * @param $value The floating point value to restrict inside the range defined by the minimum and maximum values.
            * @param $min The minimum floating point value to compare against.
            * @param $max The maximum floating point value to compare against.
            * @returns The float result between the minimum and maximum values. 
            */
            public static Clamp ($value: number, $min: number, $max: number) : number
            /** Clamps value between 0 and 1 and returns value.
            */
            public static Clamp01 ($value: number) : number
            /** Linearly interpolates between a and b by t.
            * @param $a The start value.
            * @param $b The end value.
            * @param $t The interpolation value between the two floats.
            * @returns The interpolated float result between the two float values. 
            */
            public static Lerp ($a: number, $b: number, $t: number) : number
            /** Linearly interpolates between a and b by t with no limit to t.
            * @param $a The start value.
            * @param $b The end value.
            * @param $t The interpolation between the two floats.
            * @returns The float value as a result from the linear interpolation. 
            */
            public static LerpUnclamped ($a: number, $b: number, $t: number) : number
            /** Same as Lerp but makes sure the values interpolate correctly when they wrap around 360 degrees.
            * @param $a The start angle. A float expressed in degrees.
            * @param $b The end angle. A float expressed in degrees.
            * @param $t The interpolation value between the start and end angles. This value is clamped to the range [0, 1].
            * @returns Returns the interpolated float result between angle a and angle b, based on the interpolation value t. 
            */
            public static LerpAngle ($a: number, $b: number, $t: number) : number
            /** Moves a value current towards target.
            * @param $current The current value.
            * @param $target The value to move towards.
            * @param $maxDelta The maximum change applied to the current value.
            */
            public static MoveTowards ($current: number, $target: number, $maxDelta: number) : number
            /** Same as MoveTowards but makes sure the values interpolate correctly when they wrap around 360 degrees.
            */
            public static MoveTowardsAngle ($current: number, $target: number, $maxDelta: number) : number
            /** Interpolates between from and to with smoothing at the limits.
            * @param $from The start of the range.
            * @param $to The end of the range.
            * @param $t The interpolation value between the from and to range limits.
            * @returns The interpolated float result between from and to. 
            */
            public static SmoothStep ($from: number, $to: number, $t: number) : number
            public static Gamma ($value: number, $absmax: number, $gamma: number) : number
            /** Compares two floating point values and returns true if they are similar.
            */
            public static Approximately ($a: number, $b: number) : boolean
            /** Gradually moves the current value towards a target value, over a specified time and at a specified velocity.
            * @param $current The current value.
            * @param $target The target value.
            * @param $currentVelocity Use this parameter to specify the initial velocity to move the current value towards the target value. This method updates the currentVelocity based on this movement and smooth-damping.
            * @param $smoothTime The approximate time it takes for the current value to reach the target value. The lower the smoothTime, the faster the current value reaches the target value. The minimum smoothTime is 0.0001. If a lower value is specified, it is clamped to the minimum value.
            * @param $maxSpeed Use this optional parameter to specify a maximum speed. By default, the maximum speed is set to infinity.
            * @param $deltaTime The time since this method was last called. By default, this is set to `Time.deltaTime`.
            * @returns The current value after moving one step towards the target value. 
            */
            public static SmoothDamp ($current: number, $target: number, $currentVelocity: $Ref<number>, $smoothTime: number, $maxSpeed: number) : number
            /** Gradually moves the current value towards a target value, over a specified time and at a specified velocity.
            * @param $current The current value.
            * @param $target The target value.
            * @param $currentVelocity Use this parameter to specify the initial velocity to move the current value towards the target value. This method updates the currentVelocity based on this movement and smooth-damping.
            * @param $smoothTime The approximate time it takes for the current value to reach the target value. The lower the smoothTime, the faster the current value reaches the target value. The minimum smoothTime is 0.0001. If a lower value is specified, it is clamped to the minimum value.
            * @param $maxSpeed Use this optional parameter to specify a maximum speed. By default, the maximum speed is set to infinity.
            * @param $deltaTime The time since this method was last called. By default, this is set to `Time.deltaTime`.
            * @returns The current value after moving one step towards the target value. 
            */
            public static SmoothDamp ($current: number, $target: number, $currentVelocity: $Ref<number>, $smoothTime: number) : number
            /** Gradually moves the current value towards a target value, over a specified time and at a specified velocity.
            * @param $current The current value.
            * @param $target The target value.
            * @param $currentVelocity Use this parameter to specify the initial velocity to move the current value towards the target value. This method updates the currentVelocity based on this movement and smooth-damping.
            * @param $smoothTime The approximate time it takes for the current value to reach the target value. The lower the smoothTime, the faster the current value reaches the target value. The minimum smoothTime is 0.0001. If a lower value is specified, it is clamped to the minimum value.
            * @param $maxSpeed Use this optional parameter to specify a maximum speed. By default, the maximum speed is set to infinity.
            * @param $deltaTime The time since this method was last called. By default, this is set to `Time.deltaTime`.
            * @returns The current value after moving one step towards the target value. 
            */
            public static SmoothDamp ($current: number, $target: number, $currentVelocity: $Ref<number>, $smoothTime: number, $maxSpeed: number, $deltaTime: number) : number
            /** Gradually changes an angle given in degrees towards a desired goal angle over time.
            * @param $current The current position.
            * @param $target The target position.
            * @param $currentVelocity The current velocity. This method modifies the currentVelocity every time the method is called.
            * @param $smoothTime The approximate time it takes to reach the target position. The lower the value the faster this method reaches the target. The minimum value is 0.0001. If a lower value is specified, it is automatically clamped to this minimum value.
            * @param $maxSpeed Use this optional parameter to specify a maximum speed. By default, the maximum speed is set to infinity.
            * @param $deltaTime The time since this method was last called. By default, this is set to `Time.deltaTime`.
            */
            public static SmoothDampAngle ($current: number, $target: number, $currentVelocity: $Ref<number>, $smoothTime: number, $maxSpeed: number) : number
            /** Gradually changes an angle given in degrees towards a desired goal angle over time.
            * @param $current The current position.
            * @param $target The target position.
            * @param $currentVelocity The current velocity. This method modifies the currentVelocity every time the method is called.
            * @param $smoothTime The approximate time it takes to reach the target position. The lower the value the faster this method reaches the target. The minimum value is 0.0001. If a lower value is specified, it is automatically clamped to this minimum value.
            * @param $maxSpeed Use this optional parameter to specify a maximum speed. By default, the maximum speed is set to infinity.
            * @param $deltaTime The time since this method was last called. By default, this is set to `Time.deltaTime`.
            */
            public static SmoothDampAngle ($current: number, $target: number, $currentVelocity: $Ref<number>, $smoothTime: number) : number
            /** Gradually changes an angle given in degrees towards a desired goal angle over time.
            * @param $current The current position.
            * @param $target The target position.
            * @param $currentVelocity The current velocity. This method modifies the currentVelocity every time the method is called.
            * @param $smoothTime The approximate time it takes to reach the target position. The lower the value the faster this method reaches the target. The minimum value is 0.0001. If a lower value is specified, it is automatically clamped to this minimum value.
            * @param $maxSpeed Use this optional parameter to specify a maximum speed. By default, the maximum speed is set to infinity.
            * @param $deltaTime The time since this method was last called. By default, this is set to `Time.deltaTime`.
            */
            public static SmoothDampAngle ($current: number, $target: number, $currentVelocity: $Ref<number>, $smoothTime: number, $maxSpeed: number, $deltaTime: number) : number
            /** Loops the value t, so that it is never larger than length and never smaller than 0.
            */
            public static Repeat ($t: number, $length: number) : number
            /** PingPong returns a value that increments and decrements between zero and the length. It follows the triangle wave formula where the bottom is set to zero and the peak is set to length.
            */
            public static PingPong ($t: number, $length: number) : number
            /** Determines where a value lies between two points.
            * @param $a The start of the range.
            * @param $b The end of the range.
            * @param $value The point within the range you want to calculate.
            * @returns A value between zero and one, representing where the "value" parameter falls within the range defined by a and b. 
            */
            public static InverseLerp ($a: number, $b: number, $value: number) : number
            /** Calculates the shortest difference between two angles.
            * @param $current The current angle in degrees.
            * @param $target The target angle in degrees.
            * @returns A value between -179 and 180, in degrees. 
            */
            public static DeltaAngle ($current: number, $target: number) : number
            /** Returns the next power of two that is equal to, or greater than, the argument.
            */
            public static NextPowerOfTwo ($value: number) : number
            /** Returns the closest power of two value.
            */
            public static ClosestPowerOfTwo ($value: number) : number
            /** Returns true if the value is power of two.
            */
            public static IsPowerOfTwo ($value: number) : boolean
        }
        /** Easily generate random data for games.
        */
        class Random extends System.Object
        {
            protected [__keep_incompatibility]: never;
            /** Gets or sets the full internal state of the random number generator.
            */
            public static get state(): UnityEngine.Random.State;
            public static set state(value: UnityEngine.Random.State);
            /** Returns a random float within [0.0..1.0] (range is inclusive) (Read Only).
            */
            public static get value(): number;
            /** Returns a random point inside or on a sphere with radius 1.0 (Read Only).
            */
            public static get insideUnitSphere(): UnityEngine.Vector3;
            /** Returns a random point inside or on a circle with radius 1.0 (Read Only).
            */
            public static get insideUnitCircle(): UnityEngine.Vector2;
            /** Returns a random point on the surface of a sphere with radius 1.0 (Read Only).
            */
            public static get onUnitSphere(): UnityEngine.Vector3;
            /** Returns a random rotation (Read Only).
            */
            public static get rotation(): UnityEngine.Quaternion;
            /** Returns a random rotation with uniform distribution (Read Only).
            */
            public static get rotationUniform(): UnityEngine.Quaternion;
            /** Initializes the random number generator state with a seed.
            * @param $seed Seed used to initialize the random number generator.
            */
            public static InitState ($seed: number) : void
            /** Returns a random float within [minInclusive..maxInclusive] (range is inclusive).
            */
            public static Range ($minInclusive: number, $maxInclusive: number) : number
            /** Return a random int within [minInclusive..maxExclusive) (Read Only).
            */
            public static Range ($minInclusive: number, $maxExclusive: number) : number
            /** Generates a random color from HSV and alpha ranges.
            * @param $hueMin Minimum hue [0..1].
            * @param $hueMax Maximum hue [0..1].
            * @param $saturationMin Minimum saturation [0..1].
            * @param $saturationMax Maximum saturation [0..1].
            * @param $valueMin Minimum value [0..1].
            * @param $valueMax Maximum value [0..1].
            * @param $alphaMin Minimum alpha [0..1].
            * @param $alphaMax Maximum alpha [0..1].
            * @returns A random color with HSV and alpha values in the (inclusive) input ranges. Values for each component are derived via linear interpolation of value. 
            */
            public static ColorHSV () : UnityEngine.Color
            /** Generates a random color from HSV and alpha ranges.
            * @param $hueMin Minimum hue [0..1].
            * @param $hueMax Maximum hue [0..1].
            * @param $saturationMin Minimum saturation [0..1].
            * @param $saturationMax Maximum saturation [0..1].
            * @param $valueMin Minimum value [0..1].
            * @param $valueMax Maximum value [0..1].
            * @param $alphaMin Minimum alpha [0..1].
            * @param $alphaMax Maximum alpha [0..1].
            * @returns A random color with HSV and alpha values in the (inclusive) input ranges. Values for each component are derived via linear interpolation of value. 
            */
            public static ColorHSV ($hueMin: number, $hueMax: number) : UnityEngine.Color
            /** Generates a random color from HSV and alpha ranges.
            * @param $hueMin Minimum hue [0..1].
            * @param $hueMax Maximum hue [0..1].
            * @param $saturationMin Minimum saturation [0..1].
            * @param $saturationMax Maximum saturation [0..1].
            * @param $valueMin Minimum value [0..1].
            * @param $valueMax Maximum value [0..1].
            * @param $alphaMin Minimum alpha [0..1].
            * @param $alphaMax Maximum alpha [0..1].
            * @returns A random color with HSV and alpha values in the (inclusive) input ranges. Values for each component are derived via linear interpolation of value. 
            */
            public static ColorHSV ($hueMin: number, $hueMax: number, $saturationMin: number, $saturationMax: number) : UnityEngine.Color
            /** Generates a random color from HSV and alpha ranges.
            * @param $hueMin Minimum hue [0..1].
            * @param $hueMax Maximum hue [0..1].
            * @param $saturationMin Minimum saturation [0..1].
            * @param $saturationMax Maximum saturation [0..1].
            * @param $valueMin Minimum value [0..1].
            * @param $valueMax Maximum value [0..1].
            * @param $alphaMin Minimum alpha [0..1].
            * @param $alphaMax Maximum alpha [0..1].
            * @returns A random color with HSV and alpha values in the (inclusive) input ranges. Values for each component are derived via linear interpolation of value. 
            */
            public static ColorHSV ($hueMin: number, $hueMax: number, $saturationMin: number, $saturationMax: number, $valueMin: number, $valueMax: number) : UnityEngine.Color
            /** Generates a random color from HSV and alpha ranges.
            * @param $hueMin Minimum hue [0..1].
            * @param $hueMax Maximum hue [0..1].
            * @param $saturationMin Minimum saturation [0..1].
            * @param $saturationMax Maximum saturation [0..1].
            * @param $valueMin Minimum value [0..1].
            * @param $valueMax Maximum value [0..1].
            * @param $alphaMin Minimum alpha [0..1].
            * @param $alphaMax Maximum alpha [0..1].
            * @returns A random color with HSV and alpha values in the (inclusive) input ranges. Values for each component are derived via linear interpolation of value. 
            */
            public static ColorHSV ($hueMin: number, $hueMax: number, $saturationMin: number, $saturationMax: number, $valueMin: number, $valueMax: number, $alphaMin: number, $alphaMax: number) : UnityEngine.Color
        }
        /** Overrides the global Physics.queriesHitTriggers.
        */
        enum QueryTriggerInteraction
        { UseGlobal = 0, Ignore = 1, Collide = 2 }
        /** How the joint's movement will behave along its local X axis.
        */
        class JointDrive extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            /** Strength of a rubber-band pull toward the defined direction. Only used if mode includes Position.
            */
            public get positionSpring(): number;
            public set positionSpring(value: number);
            /** Resistance strength against the Position Spring. Only used if mode includes Position.
            */
            public get positionDamper(): number;
            public set positionDamper(value: number);
            /** Amount of force applied to push the object toward the defined direction.
            */
            public get maximumForce(): number;
            public set maximumForce(value: number);
            /** Defines whether the drive is an acceleration drive or a force drive.
            */
            public get useAcceleration(): boolean;
            public set useAcceleration(value: boolean);
        }
        /** The ConfigurableJoint attempts to attain position / velocity targets based on this flag.
        */
        enum JointDriveMode
        { None = 0, Position = 1, Velocity = 2, PositionAndVelocity = 3 }
        /** JointLimits is used by the HingeJoint to limit the joints angle.
        */
        class JointLimits extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            /** The lower angular limit (in degrees) of the joint.
            */
            public get min(): number;
            public set min(value: number);
            /** The upper angular limit (in degrees) of the joint.
            */
            public get max(): number;
            public set max(value: number);
            /** Determines the size of the bounce when the joint hits it's limit. Also known as restitution.
            */
            public get bounciness(): number;
            public set bounciness(value: number);
            /** The minimum impact velocity which will cause the joint to bounce.
            */
            public get bounceMinVelocity(): number;
            public set bounceMinVelocity(value: number);
            /** Distance inside the limit value at which the limit will be considered to be active by the solver.
            */
            public get contactDistance(): number;
            public set contactDistance(value: number);
        }
        /** JointSpring is used add a spring force to HingeJoint and PhysicsMaterial.
        */
        class JointSpring extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            /** The spring forces used to reach the target position.
            */
            public spring : number
            /** The damper force uses to dampen the spring.
            */
            public damper : number
            /** The target position the joint attempts to reach.
            */
            public targetPosition : number
        }
        /** The JointMotor is used to motorize a joint.
        */
        class JointMotor extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            /** The motor will apply a force up to force to achieve targetVelocity.
            */
            public get targetVelocity(): number;
            public set targetVelocity(value: number);
            /** The motor will apply a force.
            */
            public get force(): number;
            public set force(value: number);
            /** If freeSpin is enabled the motor will only accelerate but never slow down.
            */
            public get freeSpin(): boolean;
            public set freeSpin(value: boolean);
        }
        /** The limits defined by the CharacterJoint.
        */
        class SoftJointLimit extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            /** The limit position/angle of the joint (in degrees).
            */
            public get limit(): number;
            public set limit(value: number);
            /** When the joint hits the limit, it can be made to bounce off it.
            */
            public get bounciness(): number;
            public set bounciness(value: number);
            /** Determines how far ahead in space the solver can "see" the joint limit.
            */
            public get contactDistance(): number;
            public set contactDistance(value: number);
        }
        /** The configuration of the spring attached to the joint's limits: linear and angular. Used by CharacterJoint and ConfigurableJoint.
        */
        class SoftJointLimitSpring extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            /** The stiffness of the spring limit. When stiffness is zero the limit is hard, otherwise soft.
            */
            public get spring(): number;
            public set spring(value: number);
            /** The damping of the spring limit. In effect when the stiffness of the sprint limit is not zero.
            */
            public get damper(): number;
            public set damper(value: number);
        }
        /** Constrains movement for a ConfigurableJoint along the 6 axes.
        */
        enum ConfigurableJointMotion
        { Locked = 0, Limited = 1, Free = 2 }
        /** A Camera is a device through which the player views the world.
        */
        class Camera extends UnityEngine.Behaviour
        {
            protected [__keep_incompatibility]: never;
            /** The minimum allowed aperture.
            */
            public static kMinAperture : number
            /** The maximum allowed aperture.
            */
            public static kMaxAperture : number
            /** The minimum blade count for the aperture diaphragm.
            */
            public static kMinBladeCount : number
            /** The maximum blade count for the aperture diaphragm.
            */
            public static kMaxBladeCount : number
            /** Delegate that you can use to execute custom code before a Camera culls the scene.
            */
            public static onPreCull : UnityEngine.Camera.CameraCallback
            /** Delegate that you can use to execute custom code before a Camera renders the scene.
            */
            public static onPreRender : UnityEngine.Camera.CameraCallback
            /** Delegate that you can use to execute custom code after a Camera renders the scene.
            */
            public static onPostRender : UnityEngine.Camera.CameraCallback
            /** The distance of the near clipping plane from the the Camera, in world units.
            */
            public get nearClipPlane(): number;
            public set nearClipPlane(value: number);
            /** The distance of the far clipping plane from the Camera, in world units.
            */
            public get farClipPlane(): number;
            public set farClipPlane(value: number);
            /** The vertical field of view of the Camera, in degrees.
            */
            public get fieldOfView(): number;
            public set fieldOfView(value: number);
            /** The rendering path that should be used, if possible.
            */
            public get renderingPath(): UnityEngine.RenderingPath;
            public set renderingPath(value: UnityEngine.RenderingPath);
            /** The rendering path that is currently being used (Read Only).
            */
            public get actualRenderingPath(): UnityEngine.RenderingPath;
            /** High dynamic range rendering.
            */
            public get allowHDR(): boolean;
            public set allowHDR(value: boolean);
            /** MSAA rendering.
            */
            public get allowMSAA(): boolean;
            public set allowMSAA(value: boolean);
            /** Dynamic Resolution Scaling.
            */
            public get allowDynamicResolution(): boolean;
            public set allowDynamicResolution(value: boolean);
            /** Should camera rendering be forced into a RenderTexture.
            */
            public get forceIntoRenderTexture(): boolean;
            public set forceIntoRenderTexture(value: boolean);
            /** Camera's half-size when in orthographic mode.
            */
            public get orthographicSize(): number;
            public set orthographicSize(value: number);
            /** Is the camera orthographic (true) or perspective (false)?
            */
            public get orthographic(): boolean;
            public set orthographic(value: boolean);
            /** Opaque object sorting mode.
            */
            public get opaqueSortMode(): UnityEngine.Rendering.OpaqueSortMode;
            public set opaqueSortMode(value: UnityEngine.Rendering.OpaqueSortMode);
            /** Transparent object sorting mode.
            */
            public get transparencySortMode(): UnityEngine.TransparencySortMode;
            public set transparencySortMode(value: UnityEngine.TransparencySortMode);
            /** An axis that describes the direction along which the distances of objects are measured for the purpose of sorting.
            */
            public get transparencySortAxis(): UnityEngine.Vector3;
            public set transparencySortAxis(value: UnityEngine.Vector3);
            /** Camera's depth in the camera rendering order.
            */
            public get depth(): number;
            public set depth(value: number);
            /** The aspect ratio (width divided by height).
            */
            public get aspect(): number;
            public set aspect(value: number);
            /** Get the world-space speed of the camera (Read Only).
            */
            public get velocity(): UnityEngine.Vector3;
            /** This is used to render parts of the Scene selectively.
            */
            public get cullingMask(): number;
            public set cullingMask(value: number);
            /** Mask to select which layers can trigger events on the camera.
            */
            public get eventMask(): number;
            public set eventMask(value: number);
            /** How to perform per-layer culling for a Camera.
            */
            public get layerCullSpherical(): boolean;
            public set layerCullSpherical(value: boolean);
            /** Identifies what kind of camera this is, using the CameraType enum.
            */
            public get cameraType(): UnityEngine.CameraType;
            public set cameraType(value: UnityEngine.CameraType);
            /** Sets the culling mask used to determine which objects from which Scenes to draw.
            See EditorSceneManager.SetSceneCullingMask.
            */
            public get overrideSceneCullingMask(): bigint;
            public set overrideSceneCullingMask(value: bigint);
            /** Per-layer culling distances.
            */
            public get layerCullDistances(): System.Array$1<number>;
            public set layerCullDistances(value: System.Array$1<number>);
            /** Whether or not the Camera will use occlusion culling during rendering.
            */
            public get useOcclusionCulling(): boolean;
            public set useOcclusionCulling(value: boolean);
            /** Sets a custom matrix for the camera to use for all culling queries.
            */
            public get cullingMatrix(): UnityEngine.Matrix4x4;
            public set cullingMatrix(value: UnityEngine.Matrix4x4);
            /** The color with which the screen will be cleared.
            */
            public get backgroundColor(): UnityEngine.Color;
            public set backgroundColor(value: UnityEngine.Color);
            /** How the camera clears the background.
            */
            public get clearFlags(): UnityEngine.CameraClearFlags;
            public set clearFlags(value: UnityEngine.CameraClearFlags);
            /** How and if camera generates a depth texture.
            */
            public get depthTextureMode(): UnityEngine.DepthTextureMode;
            public set depthTextureMode(value: UnityEngine.DepthTextureMode);
            /** Should the camera clear the stencil buffer after the deferred light pass?
            */
            public get clearStencilAfterLightingPass(): boolean;
            public set clearStencilAfterLightingPass(value: boolean);
            /** Enable usePhysicalProperties to use physical camera properties to compute the field of view and the frustum.
            */
            public get usePhysicalProperties(): boolean;
            public set usePhysicalProperties(value: boolean);
            /** The sensor sensitivity of the camera. To use this property, enable UsePhysicalProperties.
            */
            public get iso(): number;
            public set iso(value: number);
            /** The exposure time of the camera, in seconts. To use this property, enable UsePhysicalProperties.
            */
            public get shutterSpeed(): number;
            public set shutterSpeed(value: number);
            /** The camera aperture. To use this property, enable UsePhysicalProperties.
            */
            public get aperture(): number;
            public set aperture(value: number);
            /** The focus distance of the lens. To use this property, enable UsePhysicalProperties.
            */
            public get focusDistance(): number;
            public set focusDistance(value: number);
            /** The camera focal length, expressed in millimeters. To use this property, enable UsePhysicalProperties.
            */
            public get focalLength(): number;
            public set focalLength(value: number);
            /** The blade count in the lens of the camera. To use this property, enable UsePhysicalProperties.
            */
            public get bladeCount(): number;
            public set bladeCount(value: number);
            /** The curvature of the blades. To use this property, enable UsePhysicalProperties.
            */
            public get curvature(): UnityEngine.Vector2;
            public set curvature(value: UnityEngine.Vector2);
            /** The camera barrel clipping. To use this property, enable UsePhysicalProperties.
            */
            public get barrelClipping(): number;
            public set barrelClipping(value: number);
            /** The camera anamorphism. To use this property, enable UsePhysicalProperties.
            */
            public get anamorphism(): number;
            public set anamorphism(value: number);
            /** The size of the camera sensor, expressed in millimeters.
            */
            public get sensorSize(): UnityEngine.Vector2;
            public set sensorSize(value: UnityEngine.Vector2);
            /** The lens offset of the camera. The lens shift is relative to the sensor size. For example, a lens shift of 0.5 offsets the sensor by half its horizontal size.
            */
            public get lensShift(): UnityEngine.Vector2;
            public set lensShift(value: UnityEngine.Vector2);
            /** There are two gates for a camera, the sensor gate and the resolution gate. The physical camera sensor gate is defined by the sensorSize property, the resolution gate is defined by the render target area.
            */
            public get gateFit(): UnityEngine.Camera.GateFitMode;
            public set gateFit(value: UnityEngine.Camera.GateFitMode);
            /** Where on the screen is the camera rendered in normalized coordinates.
            */
            public get rect(): UnityEngine.Rect;
            public set rect(value: UnityEngine.Rect);
            /** Where on the screen is the camera rendered in pixel coordinates.
            */
            public get pixelRect(): UnityEngine.Rect;
            public set pixelRect(value: UnityEngine.Rect);
            /** How wide is the camera in pixels (not accounting for dynamic resolution scaling) (Read Only).
            */
            public get pixelWidth(): number;
            /** How tall is the camera in pixels (not accounting for dynamic resolution scaling) (Read Only).
            */
            public get pixelHeight(): number;
            /** How wide is the camera in pixels (accounting for dynamic resolution scaling) (Read Only).
            */
            public get scaledPixelWidth(): number;
            /** How tall is the camera in pixels (accounting for dynamic resolution scaling) (Read Only).
            */
            public get scaledPixelHeight(): number;
            /** Destination render texture.
            */
            public get targetTexture(): UnityEngine.RenderTexture;
            public set targetTexture(value: UnityEngine.RenderTexture);
            /** Gets the temporary RenderTexture target for this Camera.
            */
            public get activeTexture(): UnityEngine.RenderTexture;
            /** Set the target display for this Camera.
            */
            public get targetDisplay(): number;
            public set targetDisplay(value: number);
            /** Matrix that transforms from camera space to world space (Read Only).
            */
            public get cameraToWorldMatrix(): UnityEngine.Matrix4x4;
            /** Matrix that transforms from world to camera space.
            */
            public get worldToCameraMatrix(): UnityEngine.Matrix4x4;
            public set worldToCameraMatrix(value: UnityEngine.Matrix4x4);
            /** Set a custom projection matrix.
            */
            public get projectionMatrix(): UnityEngine.Matrix4x4;
            public set projectionMatrix(value: UnityEngine.Matrix4x4);
            /** Get or set the raw projection matrix with no camera offset (no jittering).
            */
            public get nonJitteredProjectionMatrix(): UnityEngine.Matrix4x4;
            public set nonJitteredProjectionMatrix(value: UnityEngine.Matrix4x4);
            /** Should the jittered matrix be used for transparency rendering?
            */
            public get useJitteredProjectionMatrixForTransparentRendering(): boolean;
            public set useJitteredProjectionMatrixForTransparentRendering(value: boolean);
            /** Get the view projection matrix used on the last frame.
            */
            public get previousViewProjectionMatrix(): UnityEngine.Matrix4x4;
            /** The first enabled Camera component that is tagged "MainCamera" (Read Only).
            */
            public static get main(): UnityEngine.Camera;
            /** The camera we are currently rendering with, for low-level render control only (Read Only).
            */
            public static get current(): UnityEngine.Camera;
            /** If not null, the camera will only render the contents of the specified Scene.
            */
            public get scene(): UnityEngine.SceneManagement.Scene;
            public set scene(value: UnityEngine.SceneManagement.Scene);
            /** Stereoscopic rendering.
            */
            public get stereoEnabled(): boolean;
            /** The distance between the virtual eyes. Use this to query or set the current eye separation. Note that most VR devices provide this value, in which case setting the value will have no effect.
            */
            public get stereoSeparation(): number;
            public set stereoSeparation(value: number);
            /** Distance to a point where virtual eyes converge.
            */
            public get stereoConvergence(): number;
            public set stereoConvergence(value: number);
            /** Determines whether the stereo view matrices are suitable to allow for a single pass cull.
            */
            public get areVRStereoViewMatricesWithinSingleCullTolerance(): boolean;
            /** Defines which eye of a VR display the Camera renders into.
            */
            public get stereoTargetEye(): UnityEngine.StereoTargetEyeMask;
            public set stereoTargetEye(value: UnityEngine.StereoTargetEyeMask);
            /** Returns the eye that is currently rendering.
            If called when stereo is not enabled it will return Camera.MonoOrStereoscopicEye.Mono.
            If called during a camera rendering callback such as OnRenderImage it will return the currently rendering eye.
            If called outside of a rendering callback and stereo is enabled, it will return the default eye which is Camera.MonoOrStereoscopicEye.Left.
            */
            public get stereoActiveEye(): UnityEngine.Camera.MonoOrStereoscopicEye;
            /** The number of cameras in the current Scene.
            */
            public static get allCamerasCount(): number;
            /** Returns all enabled cameras in the Scene.
            */
            public static get allCameras(): System.Array$1<UnityEngine.Camera>;
            public get sceneViewFilterMode(): UnityEngine.Camera.SceneViewFilterMode;
            /** If false, clouds are not rendered in the scene view of this camera.
            */
            public get renderCloudsInSceneView(): boolean;
            public set renderCloudsInSceneView(value: boolean);
            /** Number of command buffers set up on this camera (Read Only).
            */
            public get commandBufferCount(): number;
            /** Revert all camera parameters to default.
            */
            public Reset () : void
            /** Resets this Camera's transparency sort settings to the default. Default transparency settings are taken from GraphicsSettings instead of directly from this Camera.
            */
            public ResetTransparencySortSettings () : void
            /** Revert the aspect ratio to the screen's aspect ratio.
            */
            public ResetAspect () : void
            /** Make culling queries reflect the camera's built in parameters.
            */
            public ResetCullingMatrix () : void
            /** Make the camera render with shader replacement.
            */
            public SetReplacementShader ($shader: UnityEngine.Shader, $replacementTag: string) : void
            /** Remove shader replacement from camera.
            */
            public ResetReplacementShader () : void
            /** 
            Retrieves the effective vertical field of view of the camera, including GateFit.
            Fitting the sensor gate and the resolution gate has an impact on the final field of view. If the sensor gate aspect ratio is the same as the resolution gate aspect ratio or if the camera is not in physical mode, then this method returns the same value as the fieldofview property.
            * @returns Returns the effective vertical field of view. 
            */
            public GetGateFittedFieldOfView () : number
            /** 
            Retrieves the effective lens offset of the camera, including GateFit.
            Fitting the sensor gate and the resolution gate has an impact on the final obliqueness of the projection. If the sensor gate aspect ratio is the same as the resolution gate aspect ratio, then this method returns the same value as the lenshift property. If the camera is not in physical mode, then this methods returns Vector2.zero.
            * @returns Returns the effective lens shift value. 
            */
            public GetGateFittedLensShift () : UnityEngine.Vector2
            /** Sets the Camera to render to the chosen buffers of one or more RenderTextures.
            * @param $colorBuffer The RenderBuffer(s) to which color information will be rendered.
            * @param $depthBuffer The RenderBuffer to which depth information will be rendered.
            */
            public SetTargetBuffers ($colorBuffer: UnityEngine.RenderBuffer, $depthBuffer: UnityEngine.RenderBuffer) : void
            /** Sets the Camera to render to the chosen buffers of one or more RenderTextures.
            * @param $colorBuffer The RenderBuffer(s) to which color information will be rendered.
            * @param $depthBuffer The RenderBuffer to which depth information will be rendered.
            */
            public SetTargetBuffers ($colorBuffer: System.Array$1<UnityEngine.RenderBuffer>, $depthBuffer: UnityEngine.RenderBuffer) : void
            /** Make the rendering position reflect the camera's position in the Scene.
            */
            public ResetWorldToCameraMatrix () : void
            /** Make the projection reflect normal camera's parameters.
            */
            public ResetProjectionMatrix () : void
            /** Calculates and returns oblique near-plane projection matrix.
            * @param $clipPlane Vector4 that describes a clip plane.
            * @returns Oblique near-plane projection matrix. 
            */
            public CalculateObliqueMatrix ($clipPlane: UnityEngine.Vector4) : UnityEngine.Matrix4x4
            public WorldToScreenPoint ($position: UnityEngine.Vector3, $eye: UnityEngine.Camera.MonoOrStereoscopicEye) : UnityEngine.Vector3
            public WorldToViewportPoint ($position: UnityEngine.Vector3, $eye: UnityEngine.Camera.MonoOrStereoscopicEye) : UnityEngine.Vector3
            public ViewportToWorldPoint ($position: UnityEngine.Vector3, $eye: UnityEngine.Camera.MonoOrStereoscopicEye) : UnityEngine.Vector3
            public ScreenToWorldPoint ($position: UnityEngine.Vector3, $eye: UnityEngine.Camera.MonoOrStereoscopicEye) : UnityEngine.Vector3
            /** Transforms position from world space into screen space.
            * @param $position A 3D point in world space.
            * @param $eye Optional argument that can be used to specify which eye transform to use. Default is Mono.
            */
            public WorldToScreenPoint ($position: UnityEngine.Vector3) : UnityEngine.Vector3
            /** Transforms position from world space into viewport space.
            * @param $position A 3D point in world space.
            * @param $eye Optional argument that can be used to specify which eye transform to use. Default is Mono.
            */
            public WorldToViewportPoint ($position: UnityEngine.Vector3) : UnityEngine.Vector3
            /** Transforms position from viewport space into world space.
            * @param $position The 3d vector in Viewport space.
            * @returns The 3d vector in World space. 
            */
            public ViewportToWorldPoint ($position: UnityEngine.Vector3) : UnityEngine.Vector3
            /** Transforms a point from screen space into world space, where world space is defined as the coordinate system at the very top of your game's hierarchy.
            * @param $position A 2D screen space point in pixels, plus a z coordinate for the distance from the camera in world units. The lower left pixel of the screen is (0,0). The upper right pixel of the screen is (screen width in pixels - 1, screen height in pixels - 1).
            * @param $eye By default, Camera.MonoOrStereoscopicEye.Mono. Can be set to Camera.MonoOrStereoscopicEye.Left or Camera.MonoOrStereoscopicEye.Right for use in stereoscopic rendering (e.g., for VR).
            * @returns The world space point created by converting the screen space point at the provided distance z from the camera plane. 
            */
            public ScreenToWorldPoint ($position: UnityEngine.Vector3) : UnityEngine.Vector3
            /** Transforms position from screen space into viewport space.
            */
            public ScreenToViewportPoint ($position: UnityEngine.Vector3) : UnityEngine.Vector3
            /** Transforms position from viewport space into screen space.
            */
            public ViewportToScreenPoint ($position: UnityEngine.Vector3) : UnityEngine.Vector3
            public ViewportPointToRay ($pos: UnityEngine.Vector3, $eye: UnityEngine.Camera.MonoOrStereoscopicEye) : UnityEngine.Ray
            /** Returns a ray going from camera through a viewport point.
            * @param $eye Optional argument that can be used to specify which eye transform to use. Default is Mono.
            */
            public ViewportPointToRay ($pos: UnityEngine.Vector3) : UnityEngine.Ray
            public ScreenPointToRay ($pos: UnityEngine.Vector3, $eye: UnityEngine.Camera.MonoOrStereoscopicEye) : UnityEngine.Ray
            /** Returns a ray going from camera through a screen point.
            * @param $pos A 3D point, with the x and y coordinates containing a 2D screen space point in pixels. The lower left pixel of the screen is (0,0). The upper right pixel of the screen is (screen width in pixels - 1, screen height in pixels - 1). Unity ignores the z coordinate.
            * @param $eye Optional argument that can be used to specify which eye transform to use. Default is Mono.
            */
            public ScreenPointToRay ($pos: UnityEngine.Vector3) : UnityEngine.Ray
            public CalculateFrustumCorners ($viewport: UnityEngine.Rect, $z: number, $eye: UnityEngine.Camera.MonoOrStereoscopicEye, $outCorners: System.Array$1<UnityEngine.Vector3>) : void
            public static CalculateProjectionMatrixFromPhysicalProperties ($output: $Ref<UnityEngine.Matrix4x4>, $focalLength: number, $sensorSize: UnityEngine.Vector2, $lensShift: UnityEngine.Vector2, $nearClip: number, $farClip: number, $gateFitParameters?: UnityEngine.Camera.GateFitParameters) : void
            /** Converts focal length to field of view.
            * @param $focalLength Focal length in millimeters.
            * @param $sensorSize Sensor size in millimeters. Use the sensor height to get the vertical field of view. Use the sensor width to get the horizontal field of view.
            * @returns field of view in degrees. 
            */
            public static FocalLengthToFieldOfView ($focalLength: number, $sensorSize: number) : number
            /** Converts field of view to focal length. Use either sensor height and vertical field of view or sensor width and horizontal field of view.
            * @param $fieldOfView field of view in degrees.
            * @param $sensorSize Sensor size in millimeters.
            * @returns Focal length in millimeters. 
            */
            public static FieldOfViewToFocalLength ($fieldOfView: number, $sensorSize: number) : number
            /** Converts the horizontal field of view (FOV) to the vertical FOV, based on the value of the aspect ratio parameter.
            * @param $horizontalFOV The horizontal FOV value in degrees.
            * @param $aspectRatio The aspect ratio value used for the conversion
            */
            public static HorizontalToVerticalFieldOfView ($horizontalFieldOfView: number, $aspectRatio: number) : number
            /** Converts the vertical field of view (FOV) to the horizontal FOV, based on the value of the aspect ratio parameter.
            * @param $verticalFieldOfView The vertical FOV value in degrees.
            * @param $aspectRatio The aspect ratio value used for the conversion
            */
            public static VerticalToHorizontalFieldOfView ($verticalFieldOfView: number, $aspectRatio: number) : number
            public GetStereoNonJitteredProjectionMatrix ($eye: UnityEngine.Camera.StereoscopicEye) : UnityEngine.Matrix4x4
            public GetStereoViewMatrix ($eye: UnityEngine.Camera.StereoscopicEye) : UnityEngine.Matrix4x4
            public CopyStereoDeviceProjectionMatrixToNonJittered ($eye: UnityEngine.Camera.StereoscopicEye) : void
            public GetStereoProjectionMatrix ($eye: UnityEngine.Camera.StereoscopicEye) : UnityEngine.Matrix4x4
            public SetStereoProjectionMatrix ($eye: UnityEngine.Camera.StereoscopicEye, $matrix: UnityEngine.Matrix4x4) : void
            /** Reset the camera to using the Unity computed projection matrices for all stereoscopic eyes.
            */
            public ResetStereoProjectionMatrices () : void
            public SetStereoViewMatrix ($eye: UnityEngine.Camera.StereoscopicEye, $matrix: UnityEngine.Matrix4x4) : void
            /** Reset the camera to using the Unity computed view matrices for all stereoscopic eyes.
            */
            public ResetStereoViewMatrices () : void
            /** Fills an array of Camera with the current cameras in the Scene, without allocating a new array.
            * @param $cameras An array to be filled up with cameras currently in the Scene.
            */
            public static GetAllCameras ($cameras: System.Array$1<UnityEngine.Camera>) : number
            /** Render into a static cubemap from this camera.
            * @param $cubemap The cube map to render to.
            * @param $faceMask A bitmask which determines which of the six faces are rendered to.
            * @returns False if rendering fails, else true. 
            */
            public RenderToCubemap ($cubemap: UnityEngine.Cubemap, $faceMask: number) : boolean
            public RenderToCubemap ($cubemap: UnityEngine.Cubemap) : boolean
            /** Render into a cubemap from this camera.
            * @param $faceMask A bitfield indicating which cubemap faces should be rendered into.
            * @param $cubemap The texture to render to.
            * @returns False if rendering fails, else true. 
            */
            public RenderToCubemap ($cubemap: UnityEngine.RenderTexture, $faceMask: number) : boolean
            public RenderToCubemap ($cubemap: UnityEngine.RenderTexture) : boolean
            public RenderToCubemap ($cubemap: UnityEngine.RenderTexture, $faceMask: number, $stereoEye: UnityEngine.Camera.MonoOrStereoscopicEye) : boolean
            /** Render the camera manually.
            */
            public Render () : void
            /** Render the camera with shader replacement.
            */
            public RenderWithShader ($shader: UnityEngine.Shader, $replacementTag: string) : void
            public RenderDontRestore () : void
            public static SetupCurrent ($cur: UnityEngine.Camera) : void
            /** Makes this camera's settings match other camera.
            * @param $other Copy camera settings to the other camera.
            */
            public CopyFrom ($other: UnityEngine.Camera) : void
            /** Remove command buffers from execution at a specified place.
            * @param $evt When to execute the command buffer during rendering.
            */
            public RemoveCommandBuffers ($evt: UnityEngine.Rendering.CameraEvent) : void
            /** Remove all command buffers set on this camera.
            */
            public RemoveAllCommandBuffers () : void
            /** Add a command buffer to be executed at a specified place.
            * @param $evt When to execute the command buffer during rendering.
            * @param $buffer The buffer to execute.
            */
            public AddCommandBuffer ($evt: UnityEngine.Rendering.CameraEvent, $buffer: UnityEngine.Rendering.CommandBuffer) : void
            /** Adds a command buffer to the GPU's async compute queues and executes that command buffer when graphics processing reaches a given point.
            * @param $evt The point during the graphics processing at which this command buffer should commence on the GPU.
            * @param $buffer The buffer to execute.
            * @param $queueType The desired async compute queue type to execute the buffer on.
            */
            public AddCommandBufferAsync ($evt: UnityEngine.Rendering.CameraEvent, $buffer: UnityEngine.Rendering.CommandBuffer, $queueType: UnityEngine.Rendering.ComputeQueueType) : void
            /** Remove command buffer from execution at a specified place.
            * @param $evt When to execute the command buffer during rendering.
            * @param $buffer The buffer to execute.
            */
            public RemoveCommandBuffer ($evt: UnityEngine.Rendering.CameraEvent, $buffer: UnityEngine.Rendering.CommandBuffer) : void
            /** Get command buffers to be executed at a specified place. This API is only available with the Built-in renderer.
            * @param $evt When to execute the command buffer during rendering.
            * @returns Array of command buffers. 
            */
            public GetCommandBuffers ($evt: UnityEngine.Rendering.CameraEvent) : System.Array$1<UnityEngine.Rendering.CommandBuffer>
            /** Get culling parameters for a camera.
            * @param $cullingParameters Resultant culling parameters.
            * @param $stereoAware Generate single-pass stereo aware culling parameters.
            * @returns Flag indicating whether culling parameters are valid. 
            */
            public TryGetCullingParameters ($cullingParameters: $Ref<UnityEngine.Rendering.ScriptableCullingParameters>) : boolean
            /** Get culling parameters for a camera.
            * @param $cullingParameters Resultant culling parameters.
            * @param $stereoAware Generate single-pass stereo aware culling parameters.
            * @returns Flag indicating whether culling parameters are valid. 
            */
            public TryGetCullingParameters ($stereoAware: boolean, $cullingParameters: $Ref<UnityEngine.Rendering.ScriptableCullingParameters>) : boolean
            public constructor ()
        }
        /** Rendering path of a Camera.
        */
        enum RenderingPath
        { UsePlayerSettings = -1, VertexLit = 0, Forward = 1, DeferredLighting = 2, DeferredShading = 3 }
        /** Transparent object sorting mode of a Camera.
        */
        enum TransparencySortMode
        { Default = 0, Perspective = 1, Orthographic = 2, CustomAxis = 3 }
        /** Describes different types of camera.
        */
        enum CameraType
        { Game = 1, SceneView = 2, Preview = 4, VR = 8, Reflection = 16 }
        /** Values for Camera.clearFlags, determining what to clear when rendering a Camera.
        */
        enum CameraClearFlags
        { Skybox = 1, Color = 2, SolidColor = 2, Depth = 3, Nothing = 4 }
        /** Depth texture generation mode for Camera.
        */
        enum DepthTextureMode
        { None = 0, Depth = 1, DepthNormals = 2, MotionVectors = 4 }
        /** Shader scripts used for all rendering.
        */
        class Shader extends UnityEngine.Object
        {
            protected [__keep_incompatibility]: never;
            /** Sets the limit on the number of shader variant chunks Unity loads and keeps in memory.
            */
            public static get maximumChunksOverride(): number;
            public static set maximumChunksOverride(value: number);
            /** Shader LOD level for this shader.
            */
            public get maximumLOD(): number;
            public set maximumLOD(value: number);
            /** Shader LOD level for all shaders.
            */
            public static get globalMaximumLOD(): number;
            public static set globalMaximumLOD(value: number);
            /** Can this shader run on the end-users graphics card? (Read Only)
            */
            public get isSupported(): boolean;
            /** Render pipeline currently in use.
            */
            public static get globalRenderPipeline(): string;
            public static set globalRenderPipeline(value: string);
            /** An array containing the global shader keywords that are currently enabled.
            */
            public static get enabledGlobalKeywords(): System.Array$1<UnityEngine.Rendering.GlobalKeyword>;
            /** An array containing the global shader keywords that currently exist. This includes enabled and disabled global shader keywords.
            */
            public static get globalKeywords(): System.Array$1<UnityEngine.Rendering.GlobalKeyword>;
            /** The local keyword space of this shader.
            */
            public get keywordSpace(): UnityEngine.Rendering.LocalKeywordSpace;
            /** Render queue of this shader. (Read Only)
            */
            public get renderQueue(): number;
            /** Returns the number of shader passes on the active SubShader.
            */
            public get passCount(): number;
            /** Returns the number of SubShaders in this shader.
            */
            public get subshaderCount(): number;
            /** Finds a shader with the given name. Returns null if the shader is not found.
            */
            public static Find ($name: string) : UnityEngine.Shader
            /** Enables a global shader keyword.
            * @param $keyword The name of the Rendering.GlobalKeyword to enable.
            */
            public static EnableKeyword ($keyword: string) : void
            /** Disables a global shader keyword.
            * @param $keyword The name of the Rendering.GlobalKeyword to disable.
            */
            public static DisableKeyword ($keyword: string) : void
            /** Checks whether a global shader keyword is enabled.
            * @param $keyword The name of the Rendering.GlobalKeyword to check.
            * @returns Returns true if a global shader keyword with the given name exists, and is enabled. Otherwise, returns false. 
            */
            public static IsKeywordEnabled ($keyword: string) : boolean
            /** Enables a global shader keyword.
            * @param $keyword The name of the Rendering.GlobalKeyword to enable.
            */
            public static EnableKeyword ($keyword: $Ref<UnityEngine.Rendering.GlobalKeyword>) : void
            /** Disables a global shader keyword.
            * @param $keyword The name of the Rendering.GlobalKeyword to disable.
            */
            public static DisableKeyword ($keyword: $Ref<UnityEngine.Rendering.GlobalKeyword>) : void
            /** Sets the state of a global shader keyword.
            * @param $keyword The Rendering.GlobalKeyword to enable or disable.
            * @param $value The desired keyword state.
            */
            public static SetKeyword ($keyword: $Ref<UnityEngine.Rendering.GlobalKeyword>, $value: boolean) : void
            /** Checks whether a global shader keyword is enabled.
            * @param $keyword The Rendering.GlobalKeyword to check.
            * @returns Returns true if the given global shader keyword is enabled. Otherwise, returns false. 
            */
            public static IsKeywordEnabled ($keyword: $Ref<UnityEngine.Rendering.GlobalKeyword>) : boolean
            /** Prewarms all shader variants of all Shaders currently in memory.
            */
            public static WarmupAllShaders () : void
            /** Gets unique identifier for a shader property name.
            * @param $name Shader property name.
            * @returns Unique integer for the name. 
            */
            public static PropertyToID ($name: string) : number
            /** Returns the dependency shader.
            * @param $name The name of the dependency to query.
            */
            public GetDependency ($name: string) : UnityEngine.Shader
            /** Returns the number of passes in the given SubShader.
            * @param $subshaderIndex The index of the SubShader.
            */
            public GetPassCountInSubshader ($subshaderIndex: number) : number
            /** Searches for the tag specified by tagName on the shader's active SubShader and returns the value of the tag.
            * @param $passIndex The index of the pass.
            * @param $tagName The name of the tag.
            */
            public FindPassTagValue ($passIndex: number, $tagName: UnityEngine.Rendering.ShaderTagId) : UnityEngine.Rendering.ShaderTagId
            /** Searches for the tag specified by tagName on the SubShader specified by subshaderIndex and returns the value of the tag.
            * @param $subshaderIndex The index of the SubShader.
            * @param $passIndex The index of the pass.
            * @param $tagName The name of the tag.
            */
            public FindPassTagValue ($subshaderIndex: number, $passIndex: number, $tagName: UnityEngine.Rendering.ShaderTagId) : UnityEngine.Rendering.ShaderTagId
            /** Searches for the tag specified by tagName on the SubShader specified by subshaderIndex and returns the value of the tag.
            * @param $subshaderIndex The index of the SubShader.
            * @param $tagName The name of the tag.
            */
            public FindSubshaderTagValue ($subshaderIndex: number, $tagName: UnityEngine.Rendering.ShaderTagId) : UnityEngine.Rendering.ShaderTagId
            /** This method is deprecated. Use SetGlobalFloat or SetGlobalInteger instead.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static SetGlobalInt ($name: string, $value: number) : void
            /** This method is deprecated. Use SetGlobalFloat or SetGlobalInteger instead.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static SetGlobalInt ($nameID: number, $value: number) : void
            /** Sets a global float property for all shaders.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static SetGlobalFloat ($name: string, $value: number) : void
            /** Sets a global float property for all shaders.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static SetGlobalFloat ($nameID: number, $value: number) : void
            /** Sets a global integer property for all shaders.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static SetGlobalInteger ($name: string, $value: number) : void
            /** Sets a global integer property for all shaders.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static SetGlobalInteger ($nameID: number, $value: number) : void
            /** Sets a global vector property for all shaders.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static SetGlobalVector ($name: string, $value: UnityEngine.Vector4) : void
            /** Sets a global vector property for all shaders.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static SetGlobalVector ($nameID: number, $value: UnityEngine.Vector4) : void
            /** Sets a global color property for all shaders.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static SetGlobalColor ($name: string, $value: UnityEngine.Color) : void
            /** Sets a global color property for all shaders.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static SetGlobalColor ($nameID: number, $value: UnityEngine.Color) : void
            /** Sets a global matrix property for all shaders.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static SetGlobalMatrix ($name: string, $value: UnityEngine.Matrix4x4) : void
            /** Sets a global matrix property for all shaders.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static SetGlobalMatrix ($nameID: number, $value: UnityEngine.Matrix4x4) : void
            /** Sets a global texture property for all shaders.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            * @param $value The texture to set.
            * @param $element Optional parameter that specifies the type of data to set from the RenderTexture.
            */
            public static SetGlobalTexture ($name: string, $value: UnityEngine.Texture) : void
            /** Sets a global texture property for all shaders.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            * @param $value The texture to set.
            * @param $element Optional parameter that specifies the type of data to set from the RenderTexture.
            */
            public static SetGlobalTexture ($nameID: number, $value: UnityEngine.Texture) : void
            /** Sets a global texture property for all shaders.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            * @param $value The texture to set.
            * @param $element Optional parameter that specifies the type of data to set from the RenderTexture.
            */
            public static SetGlobalTexture ($name: string, $value: UnityEngine.RenderTexture, $element: UnityEngine.Rendering.RenderTextureSubElement) : void
            /** Sets a global texture property for all shaders.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            * @param $value The texture to set.
            * @param $element Optional parameter that specifies the type of data to set from the RenderTexture.
            */
            public static SetGlobalTexture ($nameID: number, $value: UnityEngine.RenderTexture, $element: UnityEngine.Rendering.RenderTextureSubElement) : void
            /** Sets a global buffer property for all shaders.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            * @param $value The buffer to set.
            */
            public static SetGlobalBuffer ($name: string, $value: UnityEngine.ComputeBuffer) : void
            /** Sets a global buffer property for all shaders.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            * @param $value The buffer to set.
            */
            public static SetGlobalBuffer ($nameID: number, $value: UnityEngine.ComputeBuffer) : void
            /** Sets a global buffer property for all shaders.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            * @param $value The buffer to set.
            */
            public static SetGlobalBuffer ($name: string, $value: UnityEngine.GraphicsBuffer) : void
            /** Sets a global buffer property for all shaders.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            * @param $value The buffer to set.
            */
            public static SetGlobalBuffer ($nameID: number, $value: UnityEngine.GraphicsBuffer) : void
            /** Sets a ComputeBuffer or GraphicsBuffer as a named constant buffer for all shader types.
            * @param $nameID The name ID of the constant buffer retrieved by Shader.PropertyToID.
            * @param $name The name of the constant buffer to override.
            * @param $value The buffer to override the constant buffer values with, or null to remove binding.
            * @param $offset Offset in bytes from the beginning of the buffer to bind. Must be a multiple of SystemInfo.constantBufferOffsetAlignment, or 0 if that value is 0.
            * @param $size The number of bytes to bind.
            */
            public static SetGlobalConstantBuffer ($name: string, $value: UnityEngine.ComputeBuffer, $offset: number, $size: number) : void
            /** Sets a ComputeBuffer or GraphicsBuffer as a named constant buffer for all shader types.
            * @param $nameID The name ID of the constant buffer retrieved by Shader.PropertyToID.
            * @param $name The name of the constant buffer to override.
            * @param $value The buffer to override the constant buffer values with, or null to remove binding.
            * @param $offset Offset in bytes from the beginning of the buffer to bind. Must be a multiple of SystemInfo.constantBufferOffsetAlignment, or 0 if that value is 0.
            * @param $size The number of bytes to bind.
            */
            public static SetGlobalConstantBuffer ($nameID: number, $value: UnityEngine.ComputeBuffer, $offset: number, $size: number) : void
            /** Sets a ComputeBuffer or GraphicsBuffer as a named constant buffer for all shader types.
            * @param $nameID The name ID of the constant buffer retrieved by Shader.PropertyToID.
            * @param $name The name of the constant buffer to override.
            * @param $value The buffer to override the constant buffer values with, or null to remove binding.
            * @param $offset Offset in bytes from the beginning of the buffer to bind. Must be a multiple of SystemInfo.constantBufferOffsetAlignment, or 0 if that value is 0.
            * @param $size The number of bytes to bind.
            */
            public static SetGlobalConstantBuffer ($name: string, $value: UnityEngine.GraphicsBuffer, $offset: number, $size: number) : void
            /** Sets a ComputeBuffer or GraphicsBuffer as a named constant buffer for all shader types.
            * @param $nameID The name ID of the constant buffer retrieved by Shader.PropertyToID.
            * @param $name The name of the constant buffer to override.
            * @param $value The buffer to override the constant buffer values with, or null to remove binding.
            * @param $offset Offset in bytes from the beginning of the buffer to bind. Must be a multiple of SystemInfo.constantBufferOffsetAlignment, or 0 if that value is 0.
            * @param $size The number of bytes to bind.
            */
            public static SetGlobalConstantBuffer ($nameID: number, $value: UnityEngine.GraphicsBuffer, $offset: number, $size: number) : void
            /** Sets a global RayTracingAccelerationStructure property for all shaders.
            * @param $name The name of the acceleration structure in shader code.
            * @param $nameID The name ID of the acceleration structure in shader code. Use Shader.PropertyToID to get this value.
            * @param $value The acceleration structure to set.
            */
            public static SetGlobalRayTracingAccelerationStructure ($name: string, $value: UnityEngine.Rendering.RayTracingAccelerationStructure) : void
            /** Sets a global RayTracingAccelerationStructure property for all shaders.
            * @param $name The name of the acceleration structure in shader code.
            * @param $nameID The name ID of the acceleration structure in shader code. Use Shader.PropertyToID to get this value.
            * @param $value The acceleration structure to set.
            */
            public static SetGlobalRayTracingAccelerationStructure ($nameID: number, $value: UnityEngine.Rendering.RayTracingAccelerationStructure) : void
            public static SetGlobalFloatArray ($name: string, $values: System.Collections.Generic.List$1<number>) : void
            public static SetGlobalFloatArray ($nameID: number, $values: System.Collections.Generic.List$1<number>) : void
            /** Sets a global float array property for all shaders.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static SetGlobalFloatArray ($name: string, $values: System.Array$1<number>) : void
            /** Sets a global float array property for all shaders.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static SetGlobalFloatArray ($nameID: number, $values: System.Array$1<number>) : void
            public static SetGlobalVectorArray ($name: string, $values: System.Collections.Generic.List$1<UnityEngine.Vector4>) : void
            public static SetGlobalVectorArray ($nameID: number, $values: System.Collections.Generic.List$1<UnityEngine.Vector4>) : void
            /** Sets a global vector array property for all shaders.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static SetGlobalVectorArray ($name: string, $values: System.Array$1<UnityEngine.Vector4>) : void
            /** Sets a global vector array property for all shaders.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static SetGlobalVectorArray ($nameID: number, $values: System.Array$1<UnityEngine.Vector4>) : void
            public static SetGlobalMatrixArray ($name: string, $values: System.Collections.Generic.List$1<UnityEngine.Matrix4x4>) : void
            public static SetGlobalMatrixArray ($nameID: number, $values: System.Collections.Generic.List$1<UnityEngine.Matrix4x4>) : void
            /** Sets a global matrix array property for all shaders.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static SetGlobalMatrixArray ($name: string, $values: System.Array$1<UnityEngine.Matrix4x4>) : void
            /** Sets a global matrix array property for all shaders.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static SetGlobalMatrixArray ($nameID: number, $values: System.Array$1<UnityEngine.Matrix4x4>) : void
            /** This method is deprecated. Use GetGlobalFloat or GetGlobalInteger instead.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static GetGlobalInt ($name: string) : number
            /** This method is deprecated. Use GetGlobalFloat or GetGlobalInteger instead.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static GetGlobalInt ($nameID: number) : number
            /** Gets a global float property for all shaders previously set using SetGlobalFloat.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static GetGlobalFloat ($name: string) : number
            /** Gets a global float property for all shaders previously set using SetGlobalFloat.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static GetGlobalFloat ($nameID: number) : number
            /** Gets a global integer property for all shaders previously set using SetGlobalInteger.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static GetGlobalInteger ($name: string) : number
            /** Gets a global integer property for all shaders previously set using SetGlobalInteger.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static GetGlobalInteger ($nameID: number) : number
            /** Gets a global vector property for all shaders previously set using SetGlobalVector.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static GetGlobalVector ($name: string) : UnityEngine.Vector4
            /** Gets a global vector property for all shaders previously set using SetGlobalVector.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static GetGlobalVector ($nameID: number) : UnityEngine.Vector4
            /** Gets a global color property for all shaders previously set using SetGlobalColor.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static GetGlobalColor ($name: string) : UnityEngine.Color
            /** Gets a global color property for all shaders previously set using SetGlobalColor.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static GetGlobalColor ($nameID: number) : UnityEngine.Color
            /** Gets a global matrix property for all shaders previously set using SetGlobalMatrix.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static GetGlobalMatrix ($name: string) : UnityEngine.Matrix4x4
            /** Gets a global matrix property for all shaders previously set using SetGlobalMatrix.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static GetGlobalMatrix ($nameID: number) : UnityEngine.Matrix4x4
            /** Gets a global texture property for all shaders previously set using SetGlobalTexture.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static GetGlobalTexture ($name: string) : UnityEngine.Texture
            /** Gets a global texture property for all shaders previously set using SetGlobalTexture.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static GetGlobalTexture ($nameID: number) : UnityEngine.Texture
            /** Gets a global float array for all shaders previously set using SetGlobalFloatArray.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static GetGlobalFloatArray ($name: string) : System.Array$1<number>
            /** Gets a global float array for all shaders previously set using SetGlobalFloatArray.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static GetGlobalFloatArray ($nameID: number) : System.Array$1<number>
            /** Gets a global vector array for all shaders previously set using SetGlobalVectorArray.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static GetGlobalVectorArray ($name: string) : System.Array$1<UnityEngine.Vector4>
            /** Gets a global vector array for all shaders previously set using SetGlobalVectorArray.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static GetGlobalVectorArray ($nameID: number) : System.Array$1<UnityEngine.Vector4>
            /** Gets a global matrix array for all shaders previously set using SetGlobalMatrixArray.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static GetGlobalMatrixArray ($name: string) : System.Array$1<UnityEngine.Matrix4x4>
            /** Gets a global matrix array for all shaders previously set using SetGlobalMatrixArray.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public static GetGlobalMatrixArray ($nameID: number) : System.Array$1<UnityEngine.Matrix4x4>
            public static GetGlobalFloatArray ($name: string, $values: System.Collections.Generic.List$1<number>) : void
            public static GetGlobalFloatArray ($nameID: number, $values: System.Collections.Generic.List$1<number>) : void
            public static GetGlobalVectorArray ($name: string, $values: System.Collections.Generic.List$1<UnityEngine.Vector4>) : void
            public static GetGlobalVectorArray ($nameID: number, $values: System.Collections.Generic.List$1<UnityEngine.Vector4>) : void
            public static GetGlobalMatrixArray ($name: string, $values: System.Collections.Generic.List$1<UnityEngine.Matrix4x4>) : void
            public static GetGlobalMatrixArray ($nameID: number, $values: System.Collections.Generic.List$1<UnityEngine.Matrix4x4>) : void
            /** Returns the number of properties in this Shader.
            */
            public GetPropertyCount () : number
            /** Finds the index of a shader property by its name.
            * @param $propertyName The name of the shader property.
            */
            public FindPropertyIndex ($propertyName: string) : number
            /** Returns the name of the shader property at the specified index.
            * @param $propertyIndex The index of the shader property.
            */
            public GetPropertyName ($propertyIndex: number) : string
            /** Returns the nameId of the shader property at the specified index.
            * @param $propertyIndex The index of the shader property.
            */
            public GetPropertyNameId ($propertyIndex: number) : number
            /** Returns the ShaderPropertyType of the property at the specified index.
            * @param $propertyIndex The index of the shader property.
            */
            public GetPropertyType ($propertyIndex: number) : UnityEngine.Rendering.ShaderPropertyType
            /** Returns the description string of the shader property at the specified index.
            * @param $propertyIndex The index of the shader property.
            */
            public GetPropertyDescription ($propertyIndex: number) : string
            /** Returns the ShaderPropertyFlags of the shader property at the specified index.
            * @param $propertyIndex The index of the shader property.
            */
            public GetPropertyFlags ($propertyIndex: number) : UnityEngine.Rendering.ShaderPropertyFlags
            /** Returns an array of strings containing attributes of the shader property at the specified index.
            * @param $propertyIndex The index of the shader property.
            */
            public GetPropertyAttributes ($propertyIndex: number) : System.Array$1<string>
            /** Returns the default float value of the shader property at the specified index.
            * @param $propertyIndex The index of the shader property.
            */
            public GetPropertyDefaultFloatValue ($propertyIndex: number) : number
            /** Returns the default Vector4 value of the shader property at the specified index.
            * @param $propertyIndex The index of the shader property.
            */
            public GetPropertyDefaultVectorValue ($propertyIndex: number) : UnityEngine.Vector4
            /** Returns the min and max limits for a <a href="Rendering.ShaderPropertyType.Range.html">Range</a> property at the specified index.
            * @param $propertyIndex The index of the shader property.
            */
            public GetPropertyRangeLimits ($propertyIndex: number) : UnityEngine.Vector2
            /** Returns the default int value of the shader property at the specified index.
            * @param $propertyIndex The index of the shader property.
            */
            public GetPropertyDefaultIntValue ($propertyIndex: number) : number
            /** Returns the TextureDimension of a <a href="Rendering.ShaderPropertyType.Texture.html">Texture</a> shader property at the specified index.
            * @param $propertyIndex The index of the shader property.
            */
            public GetPropertyTextureDimension ($propertyIndex: number) : UnityEngine.Rendering.TextureDimension
            /** Returns the default Texture name of a <a href="Rendering.ShaderPropertyType.Texture.html">Texture</a> shader property at the specified index.
            * @param $propertyIndex The index of the shader property.
            */
            public GetPropertyTextureDefaultName ($propertyIndex: number) : string
            /** Find the name of a texture stack a texture belongs too.
            * @param $propertyIndex Index of the property.
            * @param $stackName On exit, contanis the name of the stack if one was found.
            * @param $layerIndex On exit, contains the stack layer index of the texture property.
            * @returns True, if a stack was found for the given texture property, false if not. 
            */
            public FindTextureStack ($propertyIndex: number, $stackName: $Ref<string>, $layerIndex: $Ref<number>) : boolean
        }
        /** Base class for Texture handling.
        */
        class Texture extends UnityEngine.Object
        {
            protected [__keep_incompatibility]: never;
            /** Can be used with Texture constructors that take a mip count to indicate that all mips should be generated.  The value of this field is -1.
            */
            public static GenerateAllMips : number
            /** How many mipmap levels are in this Texture (Read Only).
            */
            public get mipmapCount(): number;
            public static get anisotropicFiltering(): UnityEngine.AnisotropicFiltering;
            public static set anisotropicFiltering(value: UnityEngine.AnisotropicFiltering);
            /** Returns the GraphicsFormat format or color format of a Texture object.
            */
            public get graphicsFormat(): UnityEngine.Experimental.Rendering.GraphicsFormat;
            /** Width of the Texture in pixels (Read Only).
            */
            public get width(): number;
            public set width(value: number);
            /** Height of the Texture in pixels (Read Only).
            */
            public get height(): number;
            public set height(value: number);
            /** Dimensionality (type) of the Texture (Read Only).
            */
            public get dimension(): UnityEngine.Rendering.TextureDimension;
            public set dimension(value: UnityEngine.Rendering.TextureDimension);
            /** Whether Unity stores an additional copy of this texture's pixel data in CPU-addressable memory.
            */
            public get isReadable(): boolean;
            /** Texture coordinate wrapping mode.
            */
            public get wrapMode(): UnityEngine.TextureWrapMode;
            public set wrapMode(value: UnityEngine.TextureWrapMode);
            /** Texture U coordinate wrapping mode.
            */
            public get wrapModeU(): UnityEngine.TextureWrapMode;
            public set wrapModeU(value: UnityEngine.TextureWrapMode);
            /** Texture V coordinate wrapping mode.
            */
            public get wrapModeV(): UnityEngine.TextureWrapMode;
            public set wrapModeV(value: UnityEngine.TextureWrapMode);
            /** Texture W coordinate wrapping mode for Texture3D.
            */
            public get wrapModeW(): UnityEngine.TextureWrapMode;
            public set wrapModeW(value: UnityEngine.TextureWrapMode);
            /** Filtering mode of the Texture.
            */
            public get filterMode(): UnityEngine.FilterMode;
            public set filterMode(value: UnityEngine.FilterMode);
            /** Defines the anisotropic filtering level of the Texture.
            */
            public get anisoLevel(): number;
            public set anisoLevel(value: number);
            /** The mipmap bias of the Texture.
            */
            public get mipMapBias(): number;
            public set mipMapBias(value: number);
            public get texelSize(): UnityEngine.Vector2;
            /** This counter is incremented when the Texture is updated.
            */
            public get updateCount(): number;
            /** Returns true if the texture pixel data is in sRGB color space (Read Only).
            */
            public get isDataSRGB(): boolean;
            /** The hash value of the Texture.
            */
            public get imageContentsHash(): UnityEngine.Hash128;
            public set imageContentsHash(value: UnityEngine.Hash128);
            /** The total amount of Texture memory that Unity would use if it loads all Textures at mipmap level 0.
            This is a theoretical value that does not take into account any input from the streaming system or any other input, for example when you set the`Texture2D.requestedMipmapLevel` manually.
            To see a Texture memory value that takes inputs into account, use `desiredTextureMemory`.
            `totalTextureMemory` only includes instances of Texture2D and CubeMap Textures. This value does not include any other Texture types, or 2D and CubeMap Textures that Unity creates internally.
            */
            public static get totalTextureMemory(): bigint;
            /** The total size of the Textures, in bytes, that Unity loads if there were no other constraints. Before Unity loads any Textures, it applies the which reduces the loaded Texture resolution if the Texture sizes exceed its value. The desiredTextureMemory value takes into account the mipmap levels that Unity has requested or that you have set manually.
            For example, if Unity does not load a Texture at full resolution because it is far away or its requested mipmap level is greater than 0,  Unity reduces the desiredTextureMemory value to match the total memory needed.
            The desiredTextureMemory value can be greater than the Texture.targetTextureMemory value.
            */
            public static get desiredTextureMemory(): bigint;
            /** The total amount of Texture memory that Unity allocates to the Textures in the scene after it applies the and finishes loading Textures. `targetTextureMemory`also takes mipmap streaming settings into account. This value only includes instances of Texture2D and CubeMap Textures. This value does not include any other Texture types, or 2D and CubeMap Textures that Unity creates internally.
            */
            public static get targetTextureMemory(): bigint;
            /** The amount of memory that all Textures in the scene use.
            */
            public static get currentTextureMemory(): bigint;
            /** The amount of memory Unity allocates for non-streaming Textures in the scene. This only includes instances of Texture2D and CubeMap Textures. This does not include any other Texture types, or 2D and CubeMap Textures that Unity creates internally.
            */
            public static get nonStreamingTextureMemory(): bigint;
            /** How many times has a Texture been uploaded due to Texture mipmap streaming.
            */
            public static get streamingMipmapUploadCount(): bigint;
            /** Number of renderers registered with the Texture streaming system.
            */
            public static get streamingRendererCount(): bigint;
            /** Number of streaming Textures.
            */
            public static get streamingTextureCount(): bigint;
            /** The number of non-streaming Textures in the scene. This includes instances of Texture2D and CubeMap Textures. This does not include any other Texture types, or 2D and CubeMap Textures that Unity creates internally.
            */
            public static get nonStreamingTextureCount(): bigint;
            /** Number of streaming Textures with outstanding mipmaps to be loaded.
            */
            public static get streamingTexturePendingLoadCount(): bigint;
            /** Number of streaming Textures with mipmaps currently loading.
            */
            public static get streamingTextureLoadingCount(): bigint;
            /** Force streaming Textures to load all mipmap levels.
            */
            public static get streamingTextureForceLoadAll(): boolean;
            public static set streamingTextureForceLoadAll(value: boolean);
            /** This property forces the streaming Texture system to discard all unused mipmaps instead of caching them until the Texture is exceeded. This is useful when you profile or write tests to keep a predictable set of Textures in memory.
            */
            public static get streamingTextureDiscardUnusedMips(): boolean;
            public static set streamingTextureDiscardUnusedMips(value: boolean);
            /** Allow Unity internals to perform Texture creation on any thread (rather than the dedicated render thread).
            */
            public static get allowThreadedTextureCreation(): boolean;
            public static set allowThreadedTextureCreation(value: boolean);
            /** GraphicsTexture that represents the texture resource uploaded to the graphics device (Read Only).
            */
            public get graphicsTexture(): UnityEngine.Rendering.GraphicsTexture;
            /** Sets Anisotropic limits.
            */
            public static SetGlobalAnisotropicFilteringLimits ($forcedMin: number, $globalMax: number) : void
            /** Retrieve a native (underlying graphics API) pointer to the Texture resource.
            * @returns Pointer to an underlying graphics API Texture resource. 
            */
            public GetNativeTexturePtr () : System.IntPtr
            /** Increment the update counter.
            */
            public IncrementUpdateCount () : void
            /** This function sets mipmap streaming debug properties on all materials known by the mipmap streaming system.
            */
            public static SetStreamingTextureMaterialDebugProperties () : void
            /** This function sets mipmap streaming debug properties on all materials known by the mipmap streaming system, using data specific to a given material texture slot.
            * @param $materialTextureSlot The material texture slot to refer to when setting up mipmap streaming debug properties.
            */
            public static SetStreamingTextureMaterialDebugProperties ($materialTextureSlot: number) : void
        }
        /** Render textures are textures that can be rendered to.
        */
        class RenderTexture extends UnityEngine.Texture
        {
            protected [__keep_incompatibility]: never;
        }
        /** Color or depth buffer part of a RenderTexture.
        */
        class RenderBuffer extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        /** Enum values for the Camera's targetEye property.
        */
        enum StereoTargetEyeMask
        { None = 0, Left = 1, Right = 2, Both = 3 }
        /** Class for handling cube maps, Use this to create or modify existing.
        */
        class Cubemap extends UnityEngine.Texture
        {
            protected [__keep_incompatibility]: never;
        }
        /** General functionality for all renderers.
        */
        class Renderer extends UnityEngine.Component
        {
            protected [__keep_incompatibility]: never;
            /** The bounding box of the renderer in world space.
            */
            public get bounds(): UnityEngine.Bounds;
            public set bounds(value: UnityEngine.Bounds);
            /** The bounding box of the renderer in local space.
            */
            public get localBounds(): UnityEngine.Bounds;
            public set localBounds(value: UnityEngine.Bounds);
            /** Makes the rendered 3D object visible if enabled.
            */
            public get enabled(): boolean;
            public set enabled(value: boolean);
            /** Is this renderer visible in any camera? (Read Only)
            */
            public get isVisible(): boolean;
            /** Does this object cast shadows?
            */
            public get shadowCastingMode(): UnityEngine.Rendering.ShadowCastingMode;
            public set shadowCastingMode(value: UnityEngine.Rendering.ShadowCastingMode);
            /** Does this object receive shadows?
            */
            public get receiveShadows(): boolean;
            public set receiveShadows(value: boolean);
            /** Allows turning off rendering for a specific component.
            */
            public get forceRenderingOff(): boolean;
            public set forceRenderingOff(value: boolean);
            /** Is this renderer a static shadow caster?
            */
            public get staticShadowCaster(): boolean;
            public set staticShadowCaster(value: boolean);
            /** Specifies the mode for motion vector rendering.
            */
            public get motionVectorGenerationMode(): UnityEngine.MotionVectorGenerationMode;
            public set motionVectorGenerationMode(value: UnityEngine.MotionVectorGenerationMode);
            /** The light probe interpolation type.
            */
            public get lightProbeUsage(): UnityEngine.Rendering.LightProbeUsage;
            public set lightProbeUsage(value: UnityEngine.Rendering.LightProbeUsage);
            /** Should reflection probes be used for this Renderer?
            */
            public get reflectionProbeUsage(): UnityEngine.Rendering.ReflectionProbeUsage;
            public set reflectionProbeUsage(value: UnityEngine.Rendering.ReflectionProbeUsage);
            /** Determines which rendering layer this renderer lives on, if you use a.
            */
            public get renderingLayerMask(): number;
            public set renderingLayerMask(value: number);
            /** This value sorts renderers by priority. Lower values are rendered first and higher values are rendered last.
            */
            public get rendererPriority(): number;
            public set rendererPriority(value: number);
            /** Describes how this renderer is updated for ray tracing.
            */
            public get rayTracingMode(): UnityEngine.Experimental.Rendering.RayTracingMode;
            public set rayTracingMode(value: UnityEngine.Experimental.Rendering.RayTracingMode);
            /** The flags Unity uses when it builds acceleration structures associated with geometry used by renderers.
            */
            public get rayTracingAccelerationStructureBuildFlags(): UnityEngine.Rendering.RayTracingAccelerationStructureBuildFlags;
            public set rayTracingAccelerationStructureBuildFlags(value: UnityEngine.Rendering.RayTracingAccelerationStructureBuildFlags);
            /** Whether to override the default build flags specified when creating a RayTracingAccelerationStructure.
            */
            public get rayTracingAccelerationStructureBuildFlagsOverride(): boolean;
            public set rayTracingAccelerationStructureBuildFlagsOverride(value: boolean);
            /** Name of the Renderer's sorting layer.
            */
            public get sortingLayerName(): string;
            public set sortingLayerName(value: string);
            /** Unique ID of the Renderer's sorting layer.
            */
            public get sortingLayerID(): number;
            public set sortingLayerID(value: number);
            /** Renderer's order within a sorting layer.
            */
            public get sortingOrder(): number;
            public set sortingOrder(value: number);
            /** Is the renderer the first LOD level in its group.
            */
            public get isLOD0(): boolean;
            /** Controls if dynamic occlusion culling should be performed for this renderer.
            */
            public get allowOcclusionWhenDynamic(): boolean;
            public set allowOcclusionWhenDynamic(value: boolean);
            /** Indicates whether the renderer is part of a with other renderers.
            */
            public get isPartOfStaticBatch(): boolean;
            /** Matrix that transforms a point from world space into local space (Read Only).
            */
            public get worldToLocalMatrix(): UnityEngine.Matrix4x4;
            /** Matrix that transforms a point from local space into world space (Read Only).
            */
            public get localToWorldMatrix(): UnityEngine.Matrix4x4;
            /** If set, the Renderer will use the Light Probe Proxy Volume component attached to the source GameObject.
            */
            public get lightProbeProxyVolumeOverride(): UnityEngine.GameObject;
            public set lightProbeProxyVolumeOverride(value: UnityEngine.GameObject);
            /** If set, Renderer will use this Transform's position to find the light or reflection probe.
            */
            public get probeAnchor(): UnityEngine.Transform;
            public set probeAnchor(value: UnityEngine.Transform);
            /** The index of the baked lightmap applied to this renderer.
            */
            public get lightmapIndex(): number;
            public set lightmapIndex(value: number);
            /** The index of the real-time lightmap applied to this renderer.
            */
            public get realtimeLightmapIndex(): number;
            public set realtimeLightmapIndex(value: number);
            /** The UV scale & offset used for a lightmap.
            */
            public get lightmapScaleOffset(): UnityEngine.Vector4;
            public set lightmapScaleOffset(value: UnityEngine.Vector4);
            /** The UV scale & offset used for a real-time lightmap.
            */
            public get realtimeLightmapScaleOffset(): UnityEngine.Vector4;
            public set realtimeLightmapScaleOffset(value: UnityEngine.Vector4);
            /** Returns all the instantiated materials of this object.
            */
            public get materials(): System.Array$1<UnityEngine.Material>;
            public set materials(value: System.Array$1<UnityEngine.Material>);
            /** Returns the first instantiated Material assigned to the renderer.
            */
            public get material(): UnityEngine.Material;
            public set material(value: UnityEngine.Material);
            /** The shared material of this object.
            */
            public get sharedMaterial(): UnityEngine.Material;
            public set sharedMaterial(value: UnityEngine.Material);
            /** All the shared materials of this object.
            */
            public get sharedMaterials(): System.Array$1<UnityEngine.Material>;
            public set sharedMaterials(value: System.Array$1<UnityEngine.Material>);
            /** The LODGroup for this Renderer.
            */
            public get LODGroup(): UnityEngine.LODGroup;
            /** Reset custom world space bounds.
            */
            public ResetBounds () : void
            /** Reset custom local space bounds.
            */
            public ResetLocalBounds () : void
            /** Returns true if the Renderer has a material property block attached via SetPropertyBlock.
            */
            public HasPropertyBlock () : boolean
            /** Lets you set or clear per-renderer or per-material parameter overrides.
            * @param $properties Property block with values you want to override.
            * @param $materialIndex The index of the Material you want to override the parameters of. The index ranges from 0 to Renderer.sharedMaterials.Length-1.
            */
            public SetPropertyBlock ($properties: UnityEngine.MaterialPropertyBlock) : void
            /** Lets you set or clear per-renderer or per-material parameter overrides.
            * @param $properties Property block with values you want to override.
            * @param $materialIndex The index of the Material you want to override the parameters of. The index ranges from 0 to Renderer.sharedMaterials.Length-1.
            */
            public SetPropertyBlock ($properties: UnityEngine.MaterialPropertyBlock, $materialIndex: number) : void
            /** Get per-Renderer or per-Material property block.
            * @param $properties Material parameters to retrieve.
            * @param $materialIndex The index of the Material you want to get overridden parameters from. The index ranges from 0 to Renderer.sharedMaterials.Length-1.
            */
            public GetPropertyBlock ($properties: UnityEngine.MaterialPropertyBlock) : void
            /** Get per-Renderer or per-Material property block.
            * @param $properties Material parameters to retrieve.
            * @param $materialIndex The index of the Material you want to get overridden parameters from. The index ranges from 0 to Renderer.sharedMaterials.Length-1.
            */
            public GetPropertyBlock ($properties: UnityEngine.MaterialPropertyBlock, $materialIndex: number) : void
            public GetMaterials ($m: System.Collections.Generic.List$1<UnityEngine.Material>) : void
            public SetSharedMaterials ($materials: System.Collections.Generic.List$1<UnityEngine.Material>) : void
            public SetMaterials ($materials: System.Collections.Generic.List$1<UnityEngine.Material>) : void
            public GetSharedMaterials ($m: System.Collections.Generic.List$1<UnityEngine.Material>) : void
            public GetClosestReflectionProbes ($result: System.Collections.Generic.List$1<UnityEngine.Rendering.ReflectionProbeBlendInfo>) : void
            public constructor ()
        }
        /** A block of material values to apply.
        */
        class MaterialPropertyBlock extends System.Object
        {
            protected [__keep_incompatibility]: never;
            /** Is the material property block empty? (Read Only)
            */
            public get isEmpty(): boolean;
            /** Clear material property values.
            */
            public Clear () : void
            /** This method is deprecated. Use SetFloat or SetInteger instead.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $value The int value to set.
            */
            public SetInt ($name: string, $value: number) : void
            /** This method is deprecated. Use SetFloat or SetInteger instead.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $value The int value to set.
            */
            public SetInt ($nameID: number, $value: number) : void
            /** Set a float property.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $value The float value to set.
            */
            public SetFloat ($name: string, $value: number) : void
            /** Set a float property.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $value The float value to set.
            */
            public SetFloat ($nameID: number, $value: number) : void
            /** Adds a property to the block. If an integer property with the given name already exists, the old value is replaced.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $value The integer value to set.
            */
            public SetInteger ($name: string, $value: number) : void
            /** Adds a property to the block. If an integer property with the given name already exists, the old value is replaced.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $value The integer value to set.
            */
            public SetInteger ($nameID: number, $value: number) : void
            /** Set a vector property.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $value The Vector4 value to set.
            */
            public SetVector ($name: string, $value: UnityEngine.Vector4) : void
            /** Set a vector property.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $value The Vector4 value to set.
            */
            public SetVector ($nameID: number, $value: UnityEngine.Vector4) : void
            /** Set a color property.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $value The Color value to set.
            */
            public SetColor ($name: string, $value: UnityEngine.Color) : void
            /** Set a color property.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $value The Color value to set.
            */
            public SetColor ($nameID: number, $value: UnityEngine.Color) : void
            /** Set a matrix property.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $value The matrix value to set.
            */
            public SetMatrix ($name: string, $value: UnityEngine.Matrix4x4) : void
            /** Set a matrix property.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $value The matrix value to set.
            */
            public SetMatrix ($nameID: number, $value: UnityEngine.Matrix4x4) : void
            /** Set a buffer property.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $value The ComputeBuffer or GraphicsBuffer to set.
            */
            public SetBuffer ($name: string, $value: UnityEngine.ComputeBuffer) : void
            /** Set a buffer property.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $value The ComputeBuffer or GraphicsBuffer to set.
            */
            public SetBuffer ($nameID: number, $value: UnityEngine.ComputeBuffer) : void
            /** Set a buffer property.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $value The ComputeBuffer or GraphicsBuffer to set.
            */
            public SetBuffer ($name: string, $value: UnityEngine.GraphicsBuffer) : void
            /** Set a buffer property.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $value The ComputeBuffer or GraphicsBuffer to set.
            */
            public SetBuffer ($nameID: number, $value: UnityEngine.GraphicsBuffer) : void
            /** Set a texture property.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $value The Texture to set.
            * @param $element Optional parameter that specifies the type of data to set from the RenderTexture.
            */
            public SetTexture ($name: string, $value: UnityEngine.Texture) : void
            /** Set a texture property.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $value The Texture to set.
            * @param $element Optional parameter that specifies the type of data to set from the RenderTexture.
            */
            public SetTexture ($nameID: number, $value: UnityEngine.Texture) : void
            /** Set a texture property.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $value The Texture to set.
            * @param $element Optional parameter that specifies the type of data to set from the RenderTexture.
            */
            public SetTexture ($name: string, $value: UnityEngine.RenderTexture, $element: UnityEngine.Rendering.RenderTextureSubElement) : void
            /** Set a texture property.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $value The Texture to set.
            * @param $element Optional parameter that specifies the type of data to set from the RenderTexture.
            */
            public SetTexture ($nameID: number, $value: UnityEngine.RenderTexture, $element: UnityEngine.Rendering.RenderTextureSubElement) : void
            /** Sets a ComputeBuffer or GraphicsBuffer as a named constant buffer for the MaterialPropertyBlock.
            * @param $name The name of the constant buffer to override.
            * @param $value The buffer to override the constant buffer values with.
            * @param $offset Offset in bytes from the beginning of the buffer to bind. Must be a multiple of SystemInfo.constantBufferOffsetAlignment, or 0 if that value is 0.
            * @param $size The number of bytes to bind.
            * @param $nameID The shader property ID of the constant buffer to override.
            */
            public SetConstantBuffer ($name: string, $value: UnityEngine.ComputeBuffer, $offset: number, $size: number) : void
            /** Sets a ComputeBuffer or GraphicsBuffer as a named constant buffer for the MaterialPropertyBlock.
            * @param $name The name of the constant buffer to override.
            * @param $value The buffer to override the constant buffer values with.
            * @param $offset Offset in bytes from the beginning of the buffer to bind. Must be a multiple of SystemInfo.constantBufferOffsetAlignment, or 0 if that value is 0.
            * @param $size The number of bytes to bind.
            * @param $nameID The shader property ID of the constant buffer to override.
            */
            public SetConstantBuffer ($nameID: number, $value: UnityEngine.ComputeBuffer, $offset: number, $size: number) : void
            /** Sets a ComputeBuffer or GraphicsBuffer as a named constant buffer for the MaterialPropertyBlock.
            * @param $name The name of the constant buffer to override.
            * @param $value The buffer to override the constant buffer values with.
            * @param $offset Offset in bytes from the beginning of the buffer to bind. Must be a multiple of SystemInfo.constantBufferOffsetAlignment, or 0 if that value is 0.
            * @param $size The number of bytes to bind.
            * @param $nameID The shader property ID of the constant buffer to override.
            */
            public SetConstantBuffer ($name: string, $value: UnityEngine.GraphicsBuffer, $offset: number, $size: number) : void
            /** Sets a ComputeBuffer or GraphicsBuffer as a named constant buffer for the MaterialPropertyBlock.
            * @param $name The name of the constant buffer to override.
            * @param $value The buffer to override the constant buffer values with.
            * @param $offset Offset in bytes from the beginning of the buffer to bind. Must be a multiple of SystemInfo.constantBufferOffsetAlignment, or 0 if that value is 0.
            * @param $size The number of bytes to bind.
            * @param $nameID The shader property ID of the constant buffer to override.
            */
            public SetConstantBuffer ($nameID: number, $value: UnityEngine.GraphicsBuffer, $offset: number, $size: number) : void
            public SetFloatArray ($name: string, $values: System.Collections.Generic.List$1<number>) : void
            public SetFloatArray ($nameID: number, $values: System.Collections.Generic.List$1<number>) : void
            /** Set a float array property.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $values The array to set.
            */
            public SetFloatArray ($name: string, $values: System.Array$1<number>) : void
            /** Set a float array property.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $values The array to set.
            */
            public SetFloatArray ($nameID: number, $values: System.Array$1<number>) : void
            public SetVectorArray ($name: string, $values: System.Collections.Generic.List$1<UnityEngine.Vector4>) : void
            public SetVectorArray ($nameID: number, $values: System.Collections.Generic.List$1<UnityEngine.Vector4>) : void
            /** Set a vector array property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $values The array to set.
            * @param $name The name of the property.
            */
            public SetVectorArray ($name: string, $values: System.Array$1<UnityEngine.Vector4>) : void
            /** Set a vector array property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $values The array to set.
            * @param $name The name of the property.
            */
            public SetVectorArray ($nameID: number, $values: System.Array$1<UnityEngine.Vector4>) : void
            public SetMatrixArray ($name: string, $values: System.Collections.Generic.List$1<UnityEngine.Matrix4x4>) : void
            public SetMatrixArray ($nameID: number, $values: System.Collections.Generic.List$1<UnityEngine.Matrix4x4>) : void
            /** Set a matrix array property.
            * @param $name The name of the property.
            * @param $values The name ID of the property retrieved by Shader.PropertyToID.
            * @param $nameID The array to set.
            */
            public SetMatrixArray ($name: string, $values: System.Array$1<UnityEngine.Matrix4x4>) : void
            /** Set a matrix array property.
            * @param $name The name of the property.
            * @param $values The name ID of the property retrieved by Shader.PropertyToID.
            * @param $nameID The array to set.
            */
            public SetMatrixArray ($nameID: number, $values: System.Array$1<UnityEngine.Matrix4x4>) : void
            /** Checks if MaterialPropertyBlock has the property with the given name or name ID. To set the property, use one of the Set methods for MaterialPropertyBlock.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @returns Returns true if MaterialPropertyBlock has this property. 
            */
            public HasProperty ($name: string) : boolean
            /** Checks if MaterialPropertyBlock has the property with the given name or name ID. To set the property, use one of the Set methods for MaterialPropertyBlock.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @returns Returns true if MaterialPropertyBlock has this property. 
            */
            public HasProperty ($nameID: number) : boolean
            /** This method is deprecated. Use HasFloat or HasInteger instead.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @returns Returns true if MaterialPropertyBlock has this property. 
            */
            public HasInt ($name: string) : boolean
            /** This method is deprecated. Use HasFloat or HasInteger instead.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @returns Returns true if MaterialPropertyBlock has this property. 
            */
            public HasInt ($nameID: number) : boolean
            /** Checks if MaterialPropertyBlock has the Float property with the given name or name ID. To set the property, use SetFloat.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @returns Returns true if MaterialPropertyBlock has this property. 
            */
            public HasFloat ($name: string) : boolean
            /** Checks if MaterialPropertyBlock has the Float property with the given name or name ID. To set the property, use SetFloat.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @returns Returns true if MaterialPropertyBlock has this property. 
            */
            public HasFloat ($nameID: number) : boolean
            /** Checks if MaterialPropertyBlock has the Integer property with the given name or name ID. To set the property, use SetInteger.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @returns Returns true if MaterialPropertyBlock has this property. 
            */
            public HasInteger ($name: string) : boolean
            /** Checks if MaterialPropertyBlock has the Integer property with the given name or name ID. To set the property, use SetInteger.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @returns Returns true if MaterialPropertyBlock has this property. 
            */
            public HasInteger ($nameID: number) : boolean
            /** Checks if MaterialPropertyBlock has the Texture property with the given name or name ID. To set the property, use SetTexture.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @returns Returns true if MaterialPropertyBlock has this property. 
            */
            public HasTexture ($name: string) : boolean
            /** Checks if MaterialPropertyBlock has the Texture property with the given name or name ID. To set the property, use SetTexture.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @returns Returns true if MaterialPropertyBlock has this property. 
            */
            public HasTexture ($nameID: number) : boolean
            /** Checks if MaterialPropertyBlock has the Matrix property with the given name or name ID. This also works with the Matrix Array property. To set the property, use SetMatrix.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @returns Returns true if MaterialPropertyBlock has this property. 
            */
            public HasMatrix ($name: string) : boolean
            /** Checks if MaterialPropertyBlock has the Matrix property with the given name or name ID. This also works with the Matrix Array property. To set the property, use SetMatrix.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @returns Returns true if MaterialPropertyBlock has this property. 
            */
            public HasMatrix ($nameID: number) : boolean
            /** Checks if MaterialPropertyBlock has the Vector property with the given name or name ID. This also works with the Vector Array property. To set the property, use SetVector.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @returns Returns true if MaterialPropertyBlock has this property. 
            */
            public HasVector ($name: string) : boolean
            /** Checks if MaterialPropertyBlock has the Vector property with the given name or name ID. This also works with the Vector Array property. To set the property, use SetVector.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @returns Returns true if MaterialPropertyBlock has this property. 
            */
            public HasVector ($nameID: number) : boolean
            /** Checks if MaterialPropertyBlock has the Color property with the given name or name ID. To set the property, use SetColor.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @returns Returns true if MaterialPropertyBlock has this property. 
            */
            public HasColor ($name: string) : boolean
            /** Checks if MaterialPropertyBlock has the Color property with the given name or name ID. To set the property, use SetColor.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @returns Returns true if MaterialPropertyBlock has this property. 
            */
            public HasColor ($nameID: number) : boolean
            /** Checks if MaterialPropertyBlock has the ComputeBuffer property with the given name or name ID. To set the property, use SetBuffer.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @param $name The name of the property.
            * @returns Returns true if MaterialPropertyBlock has this property. 
            */
            public HasBuffer ($name: string) : boolean
            /** Checks if MaterialPropertyBlock has the ComputeBuffer property with the given name or name ID. To set the property, use SetBuffer.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @param $name The name of the property.
            * @returns Returns true if MaterialPropertyBlock has this property. 
            */
            public HasBuffer ($nameID: number) : boolean
            /** Checks if MaterialPropertyBlock has the ConstantBuffer property with the given name or name ID. To set the property, use SetConstantBuffer.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @returns Returns true if MaterialPropertyBlock has this property. 
            */
            public HasConstantBuffer ($name: string) : boolean
            /** Checks if MaterialPropertyBlock has the ConstantBuffer property with the given name or name ID. To set the property, use SetConstantBuffer.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @returns Returns true if MaterialPropertyBlock has this property. 
            */
            public HasConstantBuffer ($nameID: number) : boolean
            /** Get a float from the property block.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetFloat ($name: string) : number
            /** Get a float from the property block.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetFloat ($nameID: number) : number
            /** This method is deprecated. Use GetFloat or GetInteger instead.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetInt ($name: string) : number
            /** This method is deprecated. Use GetFloat or GetInteger instead.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetInt ($nameID: number) : number
            /** Get an integer from the property block.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetInteger ($name: string) : number
            /** Get an integer from the property block.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetInteger ($nameID: number) : number
            /** Get a vector from the property block.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetVector ($name: string) : UnityEngine.Vector4
            /** Get a vector from the property block.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetVector ($nameID: number) : UnityEngine.Vector4
            /** Get a color from the property block.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetColor ($name: string) : UnityEngine.Color
            /** Get a color from the property block.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetColor ($nameID: number) : UnityEngine.Color
            /** Get a matrix from the property block.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetMatrix ($name: string) : UnityEngine.Matrix4x4
            /** Get a matrix from the property block.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetMatrix ($nameID: number) : UnityEngine.Matrix4x4
            /** Get a texture from the property block.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetTexture ($name: string) : UnityEngine.Texture
            /** Get a texture from the property block.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetTexture ($nameID: number) : UnityEngine.Texture
            /** Get a float array from the property block.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetFloatArray ($name: string) : System.Array$1<number>
            /** Get a float array from the property block.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetFloatArray ($nameID: number) : System.Array$1<number>
            /** Get a vector array from the property block.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetVectorArray ($name: string) : System.Array$1<UnityEngine.Vector4>
            /** Get a vector array from the property block.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetVectorArray ($nameID: number) : System.Array$1<UnityEngine.Vector4>
            /** Get a matrix array from the property block.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetMatrixArray ($name: string) : System.Array$1<UnityEngine.Matrix4x4>
            /** Get a matrix array from the property block.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetMatrixArray ($nameID: number) : System.Array$1<UnityEngine.Matrix4x4>
            public GetFloatArray ($name: string, $values: System.Collections.Generic.List$1<number>) : void
            public GetFloatArray ($nameID: number, $values: System.Collections.Generic.List$1<number>) : void
            public GetVectorArray ($name: string, $values: System.Collections.Generic.List$1<UnityEngine.Vector4>) : void
            public GetVectorArray ($nameID: number, $values: System.Collections.Generic.List$1<UnityEngine.Vector4>) : void
            public GetMatrixArray ($name: string, $values: System.Collections.Generic.List$1<UnityEngine.Matrix4x4>) : void
            public GetMatrixArray ($nameID: number, $values: System.Collections.Generic.List$1<UnityEngine.Matrix4x4>) : void
            public CopySHCoefficientArraysFrom ($lightProbes: System.Collections.Generic.List$1<UnityEngine.Rendering.SphericalHarmonicsL2>) : void
            /** This function converts and copies the entire source array into 7 Vector4 property arrays named unity_SHAr, unity_SHAg, unity_SHAb, unity_SHBr, unity_SHBg, unity_SHBb and unity_SHC for use with instanced rendering.
            * @param $lightProbes The array of SH values to copy from.
            */
            public CopySHCoefficientArraysFrom ($lightProbes: System.Array$1<UnityEngine.Rendering.SphericalHarmonicsL2>) : void
            public CopySHCoefficientArraysFrom ($lightProbes: System.Collections.Generic.List$1<UnityEngine.Rendering.SphericalHarmonicsL2>, $sourceStart: number, $destStart: number, $count: number) : void
            /** This function converts and copies the source array into 7 Vector4 property arrays named unity_SHAr, unity_SHAg, unity_SHAb, unity_SHBr, unity_SHBg, unity_SHBb and unity_SHC with the specified source and destination range for use with instanced rendering.
            * @param $lightProbes The array of SH values to copy from.
            * @param $sourceStart The index of the first element in the source array to copy from.
            * @param $destStart The index of the first element in the destination MaterialPropertyBlock array to copy to.
            * @param $count The number of elements to copy.
            */
            public CopySHCoefficientArraysFrom ($lightProbes: System.Array$1<UnityEngine.Rendering.SphericalHarmonicsL2>, $sourceStart: number, $destStart: number, $count: number) : void
            public CopyProbeOcclusionArrayFrom ($occlusionProbes: System.Collections.Generic.List$1<UnityEngine.Vector4>) : void
            /** This function copies the entire source array into a Vector4 property array named unity_ProbesOcclusion for use with instanced rendering.
            * @param $occlusionProbes The array of probe occlusion values to copy from.
            */
            public CopyProbeOcclusionArrayFrom ($occlusionProbes: System.Array$1<UnityEngine.Vector4>) : void
            public CopyProbeOcclusionArrayFrom ($occlusionProbes: System.Collections.Generic.List$1<UnityEngine.Vector4>, $sourceStart: number, $destStart: number, $count: number) : void
            /** This function copies the source array into a Vector4 property array named unity_ProbesOcclusion with the specified source and destination range for use with instanced rendering.
            * @param $occlusionProbes The array of probe occlusion values to copy from.
            * @param $sourceStart The index of the first element in the source array to copy from.
            * @param $destStart The index of the first element in the destination MaterialPropertyBlock array to copy to.
            * @param $count The number of elements to copy.
            */
            public CopyProbeOcclusionArrayFrom ($occlusionProbes: System.Array$1<UnityEngine.Vector4>, $sourceStart: number, $destStart: number, $count: number) : void
            public constructor ()
        }
        /** The type of motion vectors that should be generated.
        */
        enum MotionVectorGenerationMode
        { Camera = 0, Object = 1, ForceNoMotion = 2 }
        /** The material class.
        */
        class Material extends UnityEngine.Object
        {
            protected [__keep_incompatibility]: never;
            /** The shader used by the material.
            */
            public get shader(): UnityEngine.Shader;
            public set shader(value: UnityEngine.Shader);
            /** The main color of the Material.
            */
            public get color(): UnityEngine.Color;
            public set color(value: UnityEngine.Color);
            /** The main texture.
            */
            public get mainTexture(): UnityEngine.Texture;
            public set mainTexture(value: UnityEngine.Texture);
            /** The offset of the main texture.
            */
            public get mainTextureOffset(): UnityEngine.Vector2;
            public set mainTextureOffset(value: UnityEngine.Vector2);
            /** The scale of the main texture.
            */
            public get mainTextureScale(): UnityEngine.Vector2;
            public set mainTextureScale(value: UnityEngine.Vector2);
            /** Render queue of this material.
            */
            public get renderQueue(): number;
            public set renderQueue(value: number);
            /** Raw render queue of this material.
            */
            public get rawRenderQueue(): number;
            /** An array containing the local shader keywords that are currently enabled for this material.
            */
            public get enabledKeywords(): System.Array$1<UnityEngine.Rendering.LocalKeyword>;
            public set enabledKeywords(value: System.Array$1<UnityEngine.Rendering.LocalKeyword>);
            /** Defines how the material should interact with lightmaps and lightprobes.
            */
            public get globalIlluminationFlags(): UnityEngine.MaterialGlobalIlluminationFlags;
            public set globalIlluminationFlags(value: UnityEngine.MaterialGlobalIlluminationFlags);
            /** Gets and sets whether the Double Sided Global Illumination setting is enabled for this material.
            */
            public get doubleSidedGI(): boolean;
            public set doubleSidedGI(value: boolean);
            /** Gets and sets whether GPU instancing is enabled for this material.
            */
            public get enableInstancing(): boolean;
            public set enableInstancing(value: boolean);
            /** How many passes are in this material (Read Only).
            */
            public get passCount(): number;
            /** An array containing names of the local shader keywords that are currently enabled for this material.
            */
            public get shaderKeywords(): System.Array$1<string>;
            public set shaderKeywords(value: System.Array$1<string>);
            /** Parent of this material.
            */
            public get parent(): UnityEngine.Material;
            public set parent(value: UnityEngine.Material);
            /** Returns true if this material is a material variant.
            * @returns True if the material is a variant. 
            */
            public get isVariant(): boolean;
            /** Checks if the ShaderLab file assigned to the Material has a property with the given name.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @param $name The name of the property.
            * @returns Returns true if the ShaderLab file assigned to the Material has this property. 
            */
            public HasProperty ($nameID: number) : boolean
            /** Checks if the ShaderLab file assigned to the Material has a property with the given name.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @param $name The name of the property.
            * @returns Returns true if the ShaderLab file assigned to the Material has this property. 
            */
            public HasProperty ($name: string) : boolean
            /** Checks if the ShaderLab file assigned to the Material has a Float property with the given name. This also works with the Float Array property.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @param $name The name of the property.
            * @returns Returns true if the ShaderLab file assigned to the Material has this property. 
            */
            public HasFloat ($name: string) : boolean
            /** Checks if the ShaderLab file assigned to the Material has a Float property with the given name. This also works with the Float Array property.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @param $name The name of the property.
            * @returns Returns true if the ShaderLab file assigned to the Material has this property. 
            */
            public HasFloat ($nameID: number) : boolean
            /** This method is deprecated. Use HasFloat or HasInteger instead.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @param $name The name of the property.
            * @returns Returns true if the ShaderLab file assigned to the Material has this property. 
            */
            public HasInt ($name: string) : boolean
            /** This method is deprecated. Use HasFloat or HasInteger instead.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @param $name The name of the property.
            * @returns Returns true if the ShaderLab file assigned to the Material has this property. 
            */
            public HasInt ($nameID: number) : boolean
            /** Checks if the ShaderLab file assigned to the Material has an Integer property with the given name.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @param $name The name of the property.
            * @returns Returns true if the ShaderLab file assigned to the Material has this property. 
            */
            public HasInteger ($name: string) : boolean
            /** Checks if the ShaderLab file assigned to the Material has an Integer property with the given name.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @param $name The name of the property.
            * @returns Returns true if the ShaderLab file assigned to the Material has this property. 
            */
            public HasInteger ($nameID: number) : boolean
            /** Checks if the ShaderLab file assigned to the Material has a Texture property with the given name.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @param $name The name of the property.
            * @returns Returns true if the ShaderLab file assigned to the Material has this property. 
            */
            public HasTexture ($name: string) : boolean
            /** Checks if the ShaderLab file assigned to the Material has a Texture property with the given name.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @param $name The name of the property.
            * @returns Returns true if the ShaderLab file assigned to the Material has this property. 
            */
            public HasTexture ($nameID: number) : boolean
            /** Checks if the ShaderLab file assigned to the Material has a Matrix property with the given name. This also works with the Matrix Array property.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @param $name The name of the property.
            * @returns Returns true if the ShaderLab file assigned to the Material has this property. 
            */
            public HasMatrix ($name: string) : boolean
            /** Checks if the ShaderLab file assigned to the Material has a Matrix property with the given name. This also works with the Matrix Array property.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @param $name The name of the property.
            * @returns Returns true if the ShaderLab file assigned to the Material has this property. 
            */
            public HasMatrix ($nameID: number) : boolean
            /** Checks if the ShaderLab file assigned to the Material has a Vector property with the given name. This also works with the Vector Array property.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @returns Returns true if the ShaderLab file assigned to the Material has this property. 
            */
            public HasVector ($name: string) : boolean
            /** Checks if the ShaderLab file assigned to the Material has a Vector property with the given name. This also works with the Vector Array property.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @returns Returns true if the ShaderLab file assigned to the Material has this property. 
            */
            public HasVector ($nameID: number) : boolean
            /** Checks if the ShaderLab file assigned to the Material has a Color property with the given name.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @param $name The name of the property.
            * @returns Returns true if the ShaderLab file assigned to the Material has this property. 
            */
            public HasColor ($name: string) : boolean
            /** Checks if the ShaderLab file assigned to the Material has a Color property with the given name.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @param $name The name of the property.
            * @returns Returns true if the ShaderLab file assigned to the Material has this property. 
            */
            public HasColor ($nameID: number) : boolean
            /** Checks if the ShaderLab file assigned to the Material has a ComputeBuffer property with the given name.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @returns Returns true if the ShaderLab file assigned to the Material has this property. 
            */
            public HasBuffer ($name: string) : boolean
            /** Checks if the ShaderLab file assigned to the Material has a ComputeBuffer property with the given name.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @returns Returns true if the ShaderLab file assigned to the Material has this property. 
            */
            public HasBuffer ($nameID: number) : boolean
            /** Checks if the ShaderLab file assigned to the Material has a ConstantBuffer property with the given name.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @param $name The name of the property.
            * @returns Returns true if the ShaderLab file assigned to the Material has this property. 
            */
            public HasConstantBuffer ($name: string) : boolean
            /** Checks if the ShaderLab file assigned to the Material has a ConstantBuffer property with the given name.
            * @param $nameID The name ID of the property. Use Shader.PropertyToID to get this ID.
            * @param $name The name of the property.
            * @returns Returns true if the ShaderLab file assigned to the Material has this property. 
            */
            public HasConstantBuffer ($nameID: number) : boolean
            /** Enables a local shader keyword for this material.
            * @param $keyword The name of the Rendering.LocalKeyword to enable.
            */
            public EnableKeyword ($keyword: string) : void
            /** Disables a local shader keyword for this material.
            * @param $keyword The name of the Rendering.LocalKeyword to disable.
            */
            public DisableKeyword ($keyword: string) : void
            /** Checks whether a local shader keyword is enabled for this material.
            * @param $keyword The name of the Rendering.LocalKeyword to check.
            * @returns Returns true if a Rendering.LocalKeyword with the given name is enabled  for this material. 
            */
            public IsKeywordEnabled ($keyword: string) : boolean
            /** Enables a local shader keyword for this material.
            * @param $keyword The name of the Rendering.LocalKeyword to enable.
            */
            public EnableKeyword ($keyword: $Ref<UnityEngine.Rendering.LocalKeyword>) : void
            /** Disables a local shader keyword for this material.
            * @param $keyword The name of the Rendering.LocalKeyword to disable.
            */
            public DisableKeyword ($keyword: $Ref<UnityEngine.Rendering.LocalKeyword>) : void
            /** Sets the state of a local shader keyword for this material.
            * @param $keyword The Rendering.LocalKeyword to enable or disable.
            * @param $value The desired keyword state.
            */
            public SetKeyword ($keyword: $Ref<UnityEngine.Rendering.LocalKeyword>, $value: boolean) : void
            /** Checks whether a local shader keyword is enabled for this material.
            * @param $keyword The name of the Rendering.LocalKeyword to check.
            * @returns Returns true if a Rendering.LocalKeyword with the given name is enabled  for this material. 
            */
            public IsKeywordEnabled ($keyword: $Ref<UnityEngine.Rendering.LocalKeyword>) : boolean
            /** Enables or disables a Shader pass on a per-Material level.
            * @param $passName Shader pass name (case insensitive).
            * @param $enabled Flag indicating whether this Shader pass should be enabled.
            */
            public SetShaderPassEnabled ($passName: string, $enabled: boolean) : void
            /** Checks whether a given Shader pass is enabled on this Material.
            * @param $passName Shader pass name (case insensitive).
            * @returns True if the Shader pass is enabled. 
            */
            public GetShaderPassEnabled ($passName: string) : boolean
            /** Returns the name of the shader pass at index pass.
            */
            public GetPassName ($pass: number) : string
            /** Returns the index of the pass passName.
            */
            public FindPass ($passName: string) : number
            /** Sets an override tag/value on the material.
            * @param $tag Name of the tag to set.
            * @param $val Name of the value to set. Empty string to clear the override flag.
            */
            public SetOverrideTag ($tag: string, $val: string) : void
            /** Get the value of material's shader tag.
            */
            public GetTag ($tag: string, $searchFallbacks: boolean, $defaultValue: string) : string
            /** Get the value of material's shader tag.
            */
            public GetTag ($tag: string, $searchFallbacks: boolean) : string
            /** Interpolate properties between two materials.
            */
            public Lerp ($start: UnityEngine.Material, $end: UnityEngine.Material, $t: number) : void
            /** Activate the given pass for rendering.
            * @param $pass Shader pass number to setup.
            * @returns If false is returned, no rendering should be done. 
            */
            public SetPass ($pass: number) : boolean
            /** Copy properties from other material into this material.
            */
            public CopyPropertiesFromMaterial ($mat: UnityEngine.Material) : void
            /** Copies properties, keyword states and settings from mat to this material, but only if they exist in both materials.
            * @param $mat The Material to copy from.
            */
            public CopyMatchingPropertiesFromMaterial ($mat: UnityEngine.Material) : void
            /** Computes a CRC hash value from the content of the material.
            */
            public ComputeCRC () : number
            /** Returns the names of all texture properties exposed on this material.
            * @param $outNames Names of all texture properties exposed on this material.
            * @returns Names of all texture properties exposed on this material. 
            */
            public GetTexturePropertyNames () : System.Array$1<string>
            /** Return the name IDs of all texture properties exposed on this material.
            * @param $outNames IDs of all texture properties exposed on this material.
            * @returns IDs of all texture properties exposed on this material. 
            */
            public GetTexturePropertyNameIDs () : System.Array$1<number>
            public GetTexturePropertyNames ($outNames: System.Collections.Generic.List$1<string>) : void
            public GetTexturePropertyNameIDs ($outNames: System.Collections.Generic.List$1<number>) : void
            /** Returns True if the given material is an ancestor of this Material.
            * @param $ancestor The specific ancestor to find in the hierarchy.
            * @returns True if the given material is an ancestor of this Material. 
            */
            public IsChildOf ($ancestor: UnityEngine.Material) : boolean
            /** Removes all property overrides on this material.
            */
            public RevertAllPropertyOverrides () : void
            /** Checks whether a property is overriden by this material.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name, e.g. "_SrcBlend".
            * @returns Returns true if the property you pass in is overriden by this material. Otherwise, returns false. 
            */
            public IsPropertyOverriden ($nameID: number) : boolean
            /** Checks whether a property is locked by this material.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name, e.g. "_SrcBlend".
            * @returns Returns true if the property you pass in is locked by this material. Otherwise, returns false. 
            */
            public IsPropertyLocked ($nameID: number) : boolean
            /** Checks whether a property is locked by any of ancestor of this material.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name, e.g. "_SrcBlend".
            * @returns Returns true if the property you pass in is locked by any of ancestor of this material. Otherwise, returns false. 
            */
            public IsPropertyLockedByAncestor ($nameID: number) : boolean
            /** Checks whether a property is overriden by this material.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name, e.g. "_SrcBlend".
            * @returns Returns true if the property you pass in is overriden by this material. Otherwise, returns false. 
            */
            public IsPropertyOverriden ($name: string) : boolean
            /** Checks whether a property is locked by this material.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name, e.g. "_SrcBlend".
            * @returns Returns true if the property you pass in is locked by this material. Otherwise, returns false. 
            */
            public IsPropertyLocked ($name: string) : boolean
            /** Checks whether a property is locked by any of ancestor of this material.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name, e.g. "_SrcBlend".
            * @returns Returns true if the property you pass in is locked by any of ancestor of this material. Otherwise, returns false. 
            */
            public IsPropertyLockedByAncestor ($name: string) : boolean
            /** Sets the lock state of a property for this material.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name, e.g. "_SrcBlend".
            * @param $value The desired lock state.
            */
            public SetPropertyLock ($nameID: number, $value: boolean) : void
            /** Applies an override associated with a Material Variant to a target.
            * @param $destination The Material to which the Editor applies the override.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name, e.g. "_SrcBlend".
            * @param $recordUndo Wheter the editor should record an undo operation for this action.
            */
            public ApplyPropertyOverride ($destination: UnityEngine.Material, $nameID: number, $recordUndo?: boolean) : void
            /** Removes the override on a property.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name, e.g. "_SrcBlend".
            */
            public RevertPropertyOverride ($nameID: number) : void
            /** Sets the lock state of a property for this material.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name, e.g. "_SrcBlend".
            * @param $value The desired lock state.
            */
            public SetPropertyLock ($name: string, $value: boolean) : void
            /** Applies an override associated with a Material Variant to a target.
            * @param $destination The Material to which the Editor applies the override.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name, e.g. "_SrcBlend".
            * @param $recordUndo Wheter the editor should record an undo operation for this action.
            */
            public ApplyPropertyOverride ($destination: UnityEngine.Material, $name: string, $recordUndo?: boolean) : void
            /** Removes the override on a property.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name, e.g. "_SrcBlend".
            */
            public RevertPropertyOverride ($name: string) : void
            /** This method is deprecated. Use SetFloat or SetInteger instead.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $value Integer value to set.
            * @param $name Property name, e.g. "_SrcBlend".
            */
            public SetInt ($name: string, $value: number) : void
            /** This method is deprecated. Use SetFloat or SetInteger instead.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $value Integer value to set.
            * @param $name Property name, e.g. "_SrcBlend".
            */
            public SetInt ($nameID: number, $value: number) : void
            /** Sets a named float value.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $value Float value to set.
            * @param $name Property name, e.g. "_Glossiness".
            */
            public SetFloat ($name: string, $value: number) : void
            /** Sets a named float value.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $value Float value to set.
            * @param $name Property name, e.g. "_Glossiness".
            */
            public SetFloat ($nameID: number, $value: number) : void
            /** Sets a named integer value.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $value Integer value to set.
            * @param $name Property name, e.g. "_SrcBlend".
            */
            public SetInteger ($name: string, $value: number) : void
            /** Sets a named integer value.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $value Integer value to set.
            * @param $name Property name, e.g. "_SrcBlend".
            */
            public SetInteger ($nameID: number, $value: number) : void
            /** Sets a color value.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name. For example, "_Color" in Built-in Render Pipeline, "_BaseColor" in URP.
            * @param $value Color value to set.
            */
            public SetColor ($name: string, $value: UnityEngine.Color) : void
            /** Sets a color value.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name. For example, "_Color" in Built-in Render Pipeline, "_BaseColor" in URP.
            * @param $value Color value to set.
            */
            public SetColor ($nameID: number, $value: UnityEngine.Color) : void
            /** Sets a named vector value.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name, e.g. "_WaveAndDistance".
            * @param $value Vector value to set.
            */
            public SetVector ($name: string, $value: UnityEngine.Vector4) : void
            /** Sets a named vector value.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name, e.g. "_WaveAndDistance".
            * @param $value Vector value to set.
            */
            public SetVector ($nameID: number, $value: UnityEngine.Vector4) : void
            /** Sets a named matrix for the shader.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name, e.g. "_CubemapRotation".
            * @param $value Matrix value to set.
            */
            public SetMatrix ($name: string, $value: UnityEngine.Matrix4x4) : void
            /** Sets a named matrix for the shader.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name, e.g. "_CubemapRotation".
            * @param $value Matrix value to set.
            */
            public SetMatrix ($nameID: number, $value: UnityEngine.Matrix4x4) : void
            /** Sets a named texture.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name, e.g. "_MainTex".
            * @param $value Texture to set.
            * @param $element Optional parameter that specifies the type of data to set from the RenderTexture.
            */
            public SetTexture ($name: string, $value: UnityEngine.Texture) : void
            /** Sets a named texture.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name, e.g. "_MainTex".
            * @param $value Texture to set.
            * @param $element Optional parameter that specifies the type of data to set from the RenderTexture.
            */
            public SetTexture ($nameID: number, $value: UnityEngine.Texture) : void
            /** Sets a named texture.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name, e.g. "_MainTex".
            * @param $value Texture to set.
            * @param $element Optional parameter that specifies the type of data to set from the RenderTexture.
            */
            public SetTexture ($name: string, $value: UnityEngine.RenderTexture, $element: UnityEngine.Rendering.RenderTextureSubElement) : void
            /** Sets a named texture.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name, e.g. "_MainTex".
            * @param $value Texture to set.
            * @param $element Optional parameter that specifies the type of data to set from the RenderTexture.
            */
            public SetTexture ($nameID: number, $value: UnityEngine.RenderTexture, $element: UnityEngine.Rendering.RenderTextureSubElement) : void
            /** Sets a named buffer value.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name.
            * @param $value The ComputeBuffer or GraphicsBuffer value to set.
            */
            public SetBuffer ($name: string, $value: UnityEngine.ComputeBuffer) : void
            /** Sets a named buffer value.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name.
            * @param $value The ComputeBuffer or GraphicsBuffer value to set.
            */
            public SetBuffer ($nameID: number, $value: UnityEngine.ComputeBuffer) : void
            /** Sets a named buffer value.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name.
            * @param $value The ComputeBuffer or GraphicsBuffer value to set.
            */
            public SetBuffer ($name: string, $value: UnityEngine.GraphicsBuffer) : void
            /** Sets a named buffer value.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name.
            * @param $value The ComputeBuffer or GraphicsBuffer value to set.
            */
            public SetBuffer ($nameID: number, $value: UnityEngine.GraphicsBuffer) : void
            /** Sets a ComputeBuffer or GraphicsBuffer as a named constant buffer for the material.
            * @param $name The name of the constant buffer to override.
            * @param $value The ComputeBuffer to override the constant buffer values with, or null to remove binding.
            * @param $offset Offset in bytes from the beginning of the buffer to bind. Must be a multiple of SystemInfo.constantBufferOffsetAlignment, or 0 if that value is 0.
            * @param $size The number of bytes to bind.
            * @param $nameID The shader property ID of the constant buffer to override.
            */
            public SetConstantBuffer ($name: string, $value: UnityEngine.ComputeBuffer, $offset: number, $size: number) : void
            /** Sets a ComputeBuffer or GraphicsBuffer as a named constant buffer for the material.
            * @param $name The name of the constant buffer to override.
            * @param $value The ComputeBuffer to override the constant buffer values with, or null to remove binding.
            * @param $offset Offset in bytes from the beginning of the buffer to bind. Must be a multiple of SystemInfo.constantBufferOffsetAlignment, or 0 if that value is 0.
            * @param $size The number of bytes to bind.
            * @param $nameID The shader property ID of the constant buffer to override.
            */
            public SetConstantBuffer ($nameID: number, $value: UnityEngine.ComputeBuffer, $offset: number, $size: number) : void
            /** Sets a ComputeBuffer or GraphicsBuffer as a named constant buffer for the material.
            * @param $name The name of the constant buffer to override.
            * @param $value The ComputeBuffer to override the constant buffer values with, or null to remove binding.
            * @param $offset Offset in bytes from the beginning of the buffer to bind. Must be a multiple of SystemInfo.constantBufferOffsetAlignment, or 0 if that value is 0.
            * @param $size The number of bytes to bind.
            * @param $nameID The shader property ID of the constant buffer to override.
            */
            public SetConstantBuffer ($name: string, $value: UnityEngine.GraphicsBuffer, $offset: number, $size: number) : void
            /** Sets a ComputeBuffer or GraphicsBuffer as a named constant buffer for the material.
            * @param $name The name of the constant buffer to override.
            * @param $value The ComputeBuffer to override the constant buffer values with, or null to remove binding.
            * @param $offset Offset in bytes from the beginning of the buffer to bind. Must be a multiple of SystemInfo.constantBufferOffsetAlignment, or 0 if that value is 0.
            * @param $size The number of bytes to bind.
            * @param $nameID The shader property ID of the constant buffer to override.
            */
            public SetConstantBuffer ($nameID: number, $value: UnityEngine.GraphicsBuffer, $offset: number, $size: number) : void
            public SetFloatArray ($name: string, $values: System.Collections.Generic.List$1<number>) : void
            public SetFloatArray ($nameID: number, $values: System.Collections.Generic.List$1<number>) : void
            /** Sets a float array property.
            * @param $name Property name.
            * @param $nameID Property name ID. Use Shader.PropertyToID to get this ID.
            * @param $values Array of values to set.
            */
            public SetFloatArray ($name: string, $values: System.Array$1<number>) : void
            /** Sets a float array property.
            * @param $name Property name.
            * @param $nameID Property name ID. Use Shader.PropertyToID to get this ID.
            * @param $values Array of values to set.
            */
            public SetFloatArray ($nameID: number, $values: System.Array$1<number>) : void
            public SetColorArray ($name: string, $values: System.Collections.Generic.List$1<UnityEngine.Color>) : void
            public SetColorArray ($nameID: number, $values: System.Collections.Generic.List$1<UnityEngine.Color>) : void
            /** Sets a color array property.
            * @param $name Property name.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $values Array of values to set.
            */
            public SetColorArray ($name: string, $values: System.Array$1<UnityEngine.Color>) : void
            /** Sets a color array property.
            * @param $name Property name.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $values Array of values to set.
            */
            public SetColorArray ($nameID: number, $values: System.Array$1<UnityEngine.Color>) : void
            public SetVectorArray ($name: string, $values: System.Collections.Generic.List$1<UnityEngine.Vector4>) : void
            public SetVectorArray ($nameID: number, $values: System.Collections.Generic.List$1<UnityEngine.Vector4>) : void
            /** Sets a vector array property.
            * @param $name Property name.
            * @param $values Array of values to set.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            */
            public SetVectorArray ($name: string, $values: System.Array$1<UnityEngine.Vector4>) : void
            /** Sets a vector array property.
            * @param $name Property name.
            * @param $values Array of values to set.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            */
            public SetVectorArray ($nameID: number, $values: System.Array$1<UnityEngine.Vector4>) : void
            public SetMatrixArray ($name: string, $values: System.Collections.Generic.List$1<UnityEngine.Matrix4x4>) : void
            public SetMatrixArray ($nameID: number, $values: System.Collections.Generic.List$1<UnityEngine.Matrix4x4>) : void
            /** Sets a matrix array property.
            * @param $name Property name.
            * @param $values Array of values to set.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            */
            public SetMatrixArray ($name: string, $values: System.Array$1<UnityEngine.Matrix4x4>) : void
            /** Sets a matrix array property.
            * @param $name Property name.
            * @param $values Array of values to set.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            */
            public SetMatrixArray ($nameID: number, $values: System.Array$1<UnityEngine.Matrix4x4>) : void
            /** This method is deprecated. Use GetFloat or GetInteger instead.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetInt ($name: string) : number
            /** This method is deprecated. Use GetFloat or GetInteger instead.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetInt ($nameID: number) : number
            /** Get a named float value.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetFloat ($name: string) : number
            /** Get a named float value.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetFloat ($nameID: number) : number
            /** Get a named integer value.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetInteger ($name: string) : number
            /** Get a named integer value.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetInteger ($nameID: number) : number
            /** Get a named color value.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetColor ($name: string) : UnityEngine.Color
            /** Get a named color value.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetColor ($nameID: number) : UnityEngine.Color
            /** Get a named vector value.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetVector ($name: string) : UnityEngine.Vector4
            /** Get a named vector value.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetVector ($nameID: number) : UnityEngine.Vector4
            /** Get a named matrix value from the shader.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetMatrix ($name: string) : UnityEngine.Matrix4x4
            /** Get a named matrix value from the shader.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetMatrix ($nameID: number) : UnityEngine.Matrix4x4
            /** Get a named texture.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetTexture ($name: string) : UnityEngine.Texture
            /** Get a named texture.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetTexture ($nameID: number) : UnityEngine.Texture
            /** Get a named Graphics Buffer value.
            * @param $name The name of the graphics buffer resource property to return.
            * @returns Returns the handle of the graphics buffer resource property. 
            */
            public GetBuffer ($name: string) : UnityEngine.GraphicsBufferHandle
            /** Get a named Constant Buffer value.
            * @param $name The name of the constant buffer property to return.
            * @returns Returns the handle of the constant buffer graphics resource. 
            */
            public GetConstantBuffer ($name: string) : UnityEngine.GraphicsBufferHandle
            /** Get a named float array.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            */
            public GetFloatArray ($name: string) : System.Array$1<number>
            /** Get a named float array.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            */
            public GetFloatArray ($nameID: number) : System.Array$1<number>
            /** Get a named color array.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetColorArray ($name: string) : System.Array$1<UnityEngine.Color>
            /** Get a named color array.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetColorArray ($nameID: number) : System.Array$1<UnityEngine.Color>
            /** Get a named vector array.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            */
            public GetVectorArray ($name: string) : System.Array$1<UnityEngine.Vector4>
            /** Get a named vector array.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            */
            public GetVectorArray ($nameID: number) : System.Array$1<UnityEngine.Vector4>
            /** Get a named matrix array.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            */
            public GetMatrixArray ($name: string) : System.Array$1<UnityEngine.Matrix4x4>
            /** Get a named matrix array.
            * @param $name The name of the property.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            */
            public GetMatrixArray ($nameID: number) : System.Array$1<UnityEngine.Matrix4x4>
            public GetFloatArray ($name: string, $values: System.Collections.Generic.List$1<number>) : void
            public GetFloatArray ($nameID: number, $values: System.Collections.Generic.List$1<number>) : void
            public GetColorArray ($name: string, $values: System.Collections.Generic.List$1<UnityEngine.Color>) : void
            public GetColorArray ($nameID: number, $values: System.Collections.Generic.List$1<UnityEngine.Color>) : void
            public GetVectorArray ($name: string, $values: System.Collections.Generic.List$1<UnityEngine.Vector4>) : void
            public GetVectorArray ($nameID: number, $values: System.Collections.Generic.List$1<UnityEngine.Vector4>) : void
            public GetMatrixArray ($name: string, $values: System.Collections.Generic.List$1<UnityEngine.Matrix4x4>) : void
            public GetMatrixArray ($nameID: number, $values: System.Collections.Generic.List$1<UnityEngine.Matrix4x4>) : void
            /** Sets the placement offset of a given texture. The name parameter is defined in the shader. This method creates a new Material instance.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name The name of the texture property as defined in the shader. For example: "_MainTex".
            * @param $value Texture placement offset.
            */
            public SetTextureOffset ($name: string, $value: UnityEngine.Vector2) : void
            /** Sets the placement offset of a given texture. The name parameter is defined in the shader. This method creates a new Material instance.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name The name of the texture property as defined in the shader. For example: "_MainTex".
            * @param $value Texture placement offset.
            */
            public SetTextureOffset ($nameID: number, $value: UnityEngine.Vector2) : void
            /** Sets the placement scale of texture propertyName.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name, e.g. "_MainTex".
            * @param $value Texture placement scale.
            */
            public SetTextureScale ($name: string, $value: UnityEngine.Vector2) : void
            /** Sets the placement scale of texture propertyName.
            * @param $nameID Property name ID, use Shader.PropertyToID to get it.
            * @param $name Property name, e.g. "_MainTex".
            * @param $value Texture placement scale.
            */
            public SetTextureScale ($nameID: number, $value: UnityEngine.Vector2) : void
            /** Gets the placement offset of texture propertyName.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetTextureOffset ($name: string) : UnityEngine.Vector2
            /** Gets the placement offset of texture propertyName.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetTextureOffset ($nameID: number) : UnityEngine.Vector2
            /** Gets the placement scale of texture propertyName.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetTextureScale ($name: string) : UnityEngine.Vector2
            /** Gets the placement scale of texture propertyName.
            * @param $nameID The name ID of the property retrieved by Shader.PropertyToID.
            * @param $name The name of the property.
            */
            public GetTextureScale ($nameID: number) : UnityEngine.Vector2
            /** Retrieves a list of the named properties in the material that match the input property type.
            * @param $type The type to use to query the material for named properties.
            */
            public GetPropertyNames ($type: UnityEngine.MaterialPropertyType) : System.Array$1<string>
            public constructor ($shader: UnityEngine.Shader)
            public constructor ($source: UnityEngine.Material)
            public constructor ()
        }
        /** LODGroup lets you group multiple Renderers into LOD levels.
        */
        class LODGroup extends UnityEngine.Component
        {
            protected [__keep_incompatibility]: never;
        }
        /** The line renderer is used to draw free-floating lines in 3D space.
        */
        class LineRenderer extends UnityEngine.Renderer
        {
            protected [__keep_incompatibility]: never;
            /** Set the width at the start of the line.
            */
            public get startWidth(): number;
            public set startWidth(value: number);
            /** Set the width at the end of the line.
            */
            public get endWidth(): number;
            public set endWidth(value: number);
            /** Set an overall multiplier that is applied to the LineRenderer.widthCurve to get the final width of the line.
            */
            public get widthMultiplier(): number;
            public set widthMultiplier(value: number);
            /** Set this to a value greater than 0, to get rounded corners between each segment of the line.
            */
            public get numCornerVertices(): number;
            public set numCornerVertices(value: number);
            /** Set this to a value greater than 0, to get rounded corners on each end of the line. The default is 0.
            */
            public get numCapVertices(): number;
            public set numCapVertices(value: number);
            /** If enabled, the lines are defined in world space.
            */
            public get useWorldSpace(): boolean;
            public set useWorldSpace(value: boolean);
            /** Connect the start and end positions of the line together to form a continuous loop.
            */
            public get loop(): boolean;
            public set loop(value: boolean);
            /** Set the color at the start of the line.
            */
            public get startColor(): UnityEngine.Color;
            public set startColor(value: UnityEngine.Color);
            /** Set the color at the end of the line.
            */
            public get endColor(): UnityEngine.Color;
            public set endColor(value: UnityEngine.Color);
            /** Set/get the number of vertices.
            */
            public get positionCount(): number;
            public set positionCount(value: number);
            /** A multiplier for the UV coordinates of the line texture.
            */
            public get textureScale(): UnityEngine.Vector2;
            public set textureScale(value: UnityEngine.Vector2);
            /** Apply a shadow bias to prevent self-shadowing artifacts. The specified value is the proportion of the line width at each segment.
            */
            public get shadowBias(): number;
            public set shadowBias(value: number);
            /** Configures a line to generate Normals and Tangents. With this data, Scene lighting can affect the line via Normal Maps and the Unity Standard Shader, or your own custom-built Shaders.
            */
            public get generateLightingData(): boolean;
            public set generateLightingData(value: boolean);
            /** Choose whether the U coordinate of the line texture is tiled or stretched.
            */
            public get textureMode(): UnityEngine.LineTextureMode;
            public set textureMode(value: UnityEngine.LineTextureMode);
            /** Select whether the line will face the camera, or the orientation of the Transform Component.
            */
            public get alignment(): UnityEngine.LineAlignment;
            public set alignment(value: UnityEngine.LineAlignment);
            /** Specifies how the LineRenderer interacts with SpriteMask.
            */
            public get maskInteraction(): UnityEngine.SpriteMaskInteraction;
            public set maskInteraction(value: UnityEngine.SpriteMaskInteraction);
            /** Set the curve describing the width of the line at various points along its length.
            */
            public get widthCurve(): UnityEngine.AnimationCurve;
            public set widthCurve(value: UnityEngine.AnimationCurve);
            /** Set the color gradient describing the color of the line at various points along its length.
            */
            public get colorGradient(): UnityEngine.Gradient;
            public set colorGradient(value: UnityEngine.Gradient);
            /** Set the position of a vertex in the line.
            * @param $index Which position to set.
            * @param $position The new position.
            */
            public SetPosition ($index: number, $position: UnityEngine.Vector3) : void
            /** Get the position of a vertex in the line.
            * @param $index The index of the position to retrieve.
            * @returns The position at the specified index in the array. 
            */
            public GetPosition ($index: number) : UnityEngine.Vector3
            /** Generates a simplified version of the original line by removing points that fall within the specified tolerance.
            * @param $tolerance This value is used to evaluate which points should be removed from the line. A higher value results in a simpler line (less points). A positive value close to zero results in a line with little to no reduction. A value of zero or less has no effect.
            */
            public Simplify ($tolerance: number) : void
            /** Creates a snapshot of LineRenderer and stores it in mesh.
            * @param $mesh A static mesh that will receive the snapshot of the line.
            * @param $camera The camera used for determining which way camera-space lines will face.
            * @param $useTransform Include the rotation and scale of the Transform in the baked mesh.
            */
            public BakeMesh ($mesh: UnityEngine.Mesh, $useTransform?: boolean) : void
            /** Creates a snapshot of LineRenderer and stores it in mesh.
            * @param $mesh A static mesh that will receive the snapshot of the line.
            * @param $camera The camera used for determining which way camera-space lines will face.
            * @param $useTransform Include the rotation and scale of the Transform in the baked mesh.
            */
            public BakeMesh ($mesh: UnityEngine.Mesh, $camera: UnityEngine.Camera, $useTransform?: boolean) : void
            /** Get the positions of all vertices in the line.
            * @param $positions The array of positions to retrieve. The array passed should be of at least positionCount in size.
            * @returns How many positions were actually stored in the output array. 
            */
            public GetPositions ($positions: System.Array$1<UnityEngine.Vector3>) : number
            /** Set the positions of all vertices in the line.
            * @param $positions The array of positions to set.
            */
            public SetPositions ($positions: System.Array$1<UnityEngine.Vector3>) : void
            public SetPositions ($positions: Unity.Collections.NativeArray$1<UnityEngine.Vector3>) : void
            public SetPositions ($positions: Unity.Collections.NativeSlice$1<UnityEngine.Vector3>) : void
            public GetPositions ($positions: Unity.Collections.NativeArray$1<UnityEngine.Vector3>) : number
            public GetPositions ($positions: Unity.Collections.NativeSlice$1<UnityEngine.Vector3>) : number
            public constructor ()
        }
        /** Choose how textures are applied to Lines and Trails.
        */
        enum LineTextureMode
        { Stretch = 0, Tile = 1, DistributePerSegment = 2, RepeatPerSegment = 3, Static = 4 }
        /** Control the direction lines face, when using the LineRenderer or TrailRenderer.
        */
        enum LineAlignment
        { View = 0, Local = 1, TransformZ = 1 }
        /** This enum controls the mode under which the sprite will interact with the masking system.
        */
        enum SpriteMaskInteraction
        { None = 0, VisibleInsideMask = 1, VisibleOutsideMask = 2 }
        /** A class that allows you to create or modify meshes.
        */
        class Mesh extends UnityEngine.Object
        {
            protected [__keep_incompatibility]: never;
            /** Format of the mesh index buffer data.
            */
            public get indexFormat(): UnityEngine.Rendering.IndexFormat;
            public set indexFormat(value: UnityEngine.Rendering.IndexFormat);
            /** Gets the number of vertex buffers present in the Mesh. (Read Only)
            */
            public get vertexBufferCount(): number;
            /** The intended target usage of the Mesh GPU vertex buffer.
            */
            public get vertexBufferTarget(): UnityEngine.GraphicsBuffer.Target;
            public set vertexBufferTarget(value: UnityEngine.GraphicsBuffer.Target);
            /** The intended target usage of the Mesh GPU index buffer.
            */
            public get indexBufferTarget(): UnityEngine.GraphicsBuffer.Target;
            public set indexBufferTarget(value: UnityEngine.GraphicsBuffer.Target);
            /** Returns BlendShape count on this mesh.
            */
            public get blendShapeCount(): number;
            /** The number of bind poses in the Mesh.
            */
            public get bindposeCount(): number;
            /** The bind poses. The bind pose at each index refers to the bone with the same index.
            */
            public get bindposes(): System.Array$1<UnityEngine.Matrix4x4>;
            public set bindposes(value: System.Array$1<UnityEngine.Matrix4x4>);
            /** Returns true if the Mesh is read/write enabled, or false if it is not.
            */
            public get isReadable(): boolean;
            /** Returns the number of vertices in the Mesh (Read Only).
            */
            public get vertexCount(): number;
            /** The number of sub-meshes inside the Mesh object.
            */
            public get subMeshCount(): number;
            public set subMeshCount(value: number);
            /** The bounding volume of the Mesh.
            */
            public get bounds(): UnityEngine.Bounds;
            public set bounds(value: UnityEngine.Bounds);
            /** Returns a copy of the vertex positions or assigns a new vertex positions array.
            */
            public get vertices(): System.Array$1<UnityEngine.Vector3>;
            public set vertices(value: System.Array$1<UnityEngine.Vector3>);
            /** The normals of the Mesh.
            */
            public get normals(): System.Array$1<UnityEngine.Vector3>;
            public set normals(value: System.Array$1<UnityEngine.Vector3>);
            /** The tangents of the Mesh.
            */
            public get tangents(): System.Array$1<UnityEngine.Vector4>;
            public set tangents(value: System.Array$1<UnityEngine.Vector4>);
            /** The texture coordinates (UVs) in the first channel.
            */
            public get uv(): System.Array$1<UnityEngine.Vector2>;
            public set uv(value: System.Array$1<UnityEngine.Vector2>);
            /** The texture coordinates (UVs) in the second channel.
            */
            public get uv2(): System.Array$1<UnityEngine.Vector2>;
            public set uv2(value: System.Array$1<UnityEngine.Vector2>);
            /** The texture coordinates (UVs) in the third channel.
            */
            public get uv3(): System.Array$1<UnityEngine.Vector2>;
            public set uv3(value: System.Array$1<UnityEngine.Vector2>);
            /** The texture coordinates (UVs) in the fourth channel.
            */
            public get uv4(): System.Array$1<UnityEngine.Vector2>;
            public set uv4(value: System.Array$1<UnityEngine.Vector2>);
            /** The texture coordinates (UVs) in the fifth channel.
            */
            public get uv5(): System.Array$1<UnityEngine.Vector2>;
            public set uv5(value: System.Array$1<UnityEngine.Vector2>);
            /** The texture coordinates (UVs) in the sixth channel.
            */
            public get uv6(): System.Array$1<UnityEngine.Vector2>;
            public set uv6(value: System.Array$1<UnityEngine.Vector2>);
            /** The texture coordinates (UVs) in the seventh channel.
            */
            public get uv7(): System.Array$1<UnityEngine.Vector2>;
            public set uv7(value: System.Array$1<UnityEngine.Vector2>);
            /** The texture coordinates (UVs) in the eighth channel.
            */
            public get uv8(): System.Array$1<UnityEngine.Vector2>;
            public set uv8(value: System.Array$1<UnityEngine.Vector2>);
            /** Vertex colors of the Mesh.
            */
            public get colors(): System.Array$1<UnityEngine.Color>;
            public set colors(value: System.Array$1<UnityEngine.Color>);
            /** Vertex colors of the Mesh.
            */
            public get colors32(): System.Array$1<UnityEngine.Color32>;
            public set colors32(value: System.Array$1<UnityEngine.Color32>);
            /** Returns the number of vertex attributes that the mesh has. (Read Only)
            */
            public get vertexAttributeCount(): number;
            /** An array containing all triangles in the Mesh.
            */
            public get triangles(): System.Array$1<number>;
            public set triangles(value: System.Array$1<number>);
            /** The BoneWeight for each vertex in the Mesh, which represents 4 bones per vertex.
            */
            public get boneWeights(): System.Array$1<UnityEngine.BoneWeight>;
            public set boneWeights(value: System.Array$1<UnityEngine.BoneWeight>);
            /** The dimension of data in the bone weight buffer.
            */
            public get skinWeightBufferLayout(): UnityEngine.SkinWeights;
            /** Sets the index buffer size and format.
            * @param $indexCount Size of index buffer.
            * @param $format Format of the indices.
            */
            public SetIndexBufferParams ($indexCount: number, $format: UnityEngine.Rendering.IndexFormat) : void
            /** Returns information about a vertex attribute based on its index.
            * @param $index The vertex attribute index (0 to vertexAttributeCount-1).
            * @returns Information about the vertex attribute. 
            */
            public GetVertexAttribute ($index: number) : UnityEngine.Rendering.VertexAttributeDescriptor
            /** Checks if a specific vertex data attribute exists on this Mesh.
            * @param $attr Vertex data attribute to check for.
            * @returns Returns true if the data attribute is present in the mesh. 
            */
            public HasVertexAttribute ($attr: UnityEngine.Rendering.VertexAttribute) : boolean
            /** Get dimension of a specific vertex data attribute on this Mesh.
            * @param $attr Vertex data attribute to check for.
            * @returns Dimensionality of the data attribute, or zero if it is not present. 
            */
            public GetVertexAttributeDimension ($attr: UnityEngine.Rendering.VertexAttribute) : number
            /** Get format of a specific vertex data attribute on this Mesh.
            * @param $attr Vertex data attribute to check for.
            * @returns Format of the data attribute. 
            */
            public GetVertexAttributeFormat ($attr: UnityEngine.Rendering.VertexAttribute) : UnityEngine.Rendering.VertexAttributeFormat
            /** Gets the vertex buffer stream index of a specific vertex data attribute on this Mesh.
            * @param $attr The vertex data attribute to check for.
            * @returns Stream index of the data attribute, or -1 if it is not present. 
            */
            public GetVertexAttributeStream ($attr: UnityEngine.Rendering.VertexAttribute) : number
            /** Get offset within a vertex buffer stream of a specific vertex data attribute on this Mesh.
            * @param $attr The vertex data attribute to check for.
            * @returns The byte offset within a atream of the data attribute, or -1 if it is not present. 
            */
            public GetVertexAttributeOffset ($attr: UnityEngine.Rendering.VertexAttribute) : number
            /** Get vertex buffer stream stride in bytes.
            * @param $stream Vertex data stream index to check for.
            * @returns Vertex data size in bytes in this stream, or zero if the stream is not present. 
            */
            public GetVertexBufferStride ($stream: number) : number
            /** Retrieves a native (underlying graphics API) pointer to the vertex buffer.
            * @param $index Which vertex buffer to get (some Meshes might have more than one). See vertexBufferCount.
            * @returns Pointer to the underlying graphics API vertex buffer. 
            */
            public GetNativeVertexBufferPtr ($index: number) : System.IntPtr
            /** Retrieves a native (underlying graphics API) pointer to the index buffer.
            * @returns Pointer to the underlying graphics API index buffer. 
            */
            public GetNativeIndexBufferPtr () : System.IntPtr
            /** Clears all blend shapes from Mesh.
            */
            public ClearBlendShapes () : void
            /** Returns name of BlendShape by given index.
            */
            public GetBlendShapeName ($shapeIndex: number) : string
            /** Returns index of BlendShape by given name.
            */
            public GetBlendShapeIndex ($blendShapeName: string) : number
            /** Returns the frame count for a blend shape.
            * @param $shapeIndex The shape index to get frame count from.
            */
            public GetBlendShapeFrameCount ($shapeIndex: number) : number
            /** Returns the weight of a blend shape frame.
            * @param $shapeIndex The shape index of the frame.
            * @param $frameIndex The frame index to get the weight from.
            */
            public GetBlendShapeFrameWeight ($shapeIndex: number, $frameIndex: number) : number
            /** Retreives deltaVertices, deltaNormals and deltaTangents of a blend shape frame.
            * @param $shapeIndex The shape index of the frame.
            * @param $frameIndex The frame index to get the weight from.
            * @param $deltaVertices Delta vertices output array for the frame being retreived.
            * @param $deltaNormals Delta normals output array for the frame being retreived.
            * @param $deltaTangents Delta tangents output array for the frame being retreived.
            */
            public GetBlendShapeFrameVertices ($shapeIndex: number, $frameIndex: number, $deltaVertices: System.Array$1<UnityEngine.Vector3>, $deltaNormals: System.Array$1<UnityEngine.Vector3>, $deltaTangents: System.Array$1<UnityEngine.Vector3>) : void
            /** Adds a new blend shape frame.
            * @param $shapeName Name of the blend shape to add a frame to.
            * @param $frameWeight Weight for the frame being added.
            * @param $deltaVertices Delta vertices for the frame being added.
            * @param $deltaNormals Delta normals for the frame being added.
            * @param $deltaTangents Delta tangents for the frame being added.
            */
            public AddBlendShapeFrame ($shapeName: string, $frameWeight: number, $deltaVertices: System.Array$1<UnityEngine.Vector3>, $deltaNormals: System.Array$1<UnityEngine.Vector3>, $deltaTangents: System.Array$1<UnityEngine.Vector3>) : void
            public SetBoneWeights ($bonesPerVertex: Unity.Collections.NativeArray$1<number>, $weights: Unity.Collections.NativeArray$1<UnityEngine.BoneWeight1>) : void
            /** Gets the bone weights for the Mesh.
            * @returns Returns all non-zero bone weights for the Mesh, in vertex index order. 
            */
            public GetAllBoneWeights () : Unity.Collections.NativeArray$1<UnityEngine.BoneWeight1>
            /** The number of non-zero bone weights for each vertex.
            * @returns Returns the number of non-zero bone weights for each vertex. 
            */
            public GetBonesPerVertex () : Unity.Collections.NativeArray$1<number>
            /** Gets the bind poses of the Mesh.
            * @returns The array of bind poses belonging to the Mesh. 
            */
            public GetBindposes () : Unity.Collections.NativeArray$1<UnityEngine.Matrix4x4>
            public SetBindposes ($poses: Unity.Collections.NativeArray$1<UnityEngine.Matrix4x4>) : void
            /** Sets the information about a sub-mesh of the Mesh.
            * @param $index Sub-mesh index. See subMeshCount. Out of range indices throw an exception.
            * @param $desc Sub-mesh data.
            * @param $flags Flags controlling the function behavior, see MeshUpdateFlags.
            */
            public SetSubMesh ($index: number, $desc: UnityEngine.Rendering.SubMeshDescriptor, $flags?: UnityEngine.Rendering.MeshUpdateFlags) : void
            /** Get information about a sub-mesh of the Mesh.
            * @param $index Sub-mesh index. See subMeshCount. Out of range indices throw an exception.
            * @returns Sub-mesh data. 
            */
            public GetSubMesh ($index: number) : UnityEngine.Rendering.SubMeshDescriptor
            /** Notify Renderer components of mesh geometry change.
            */
            public MarkModified () : void
            /** The UV distribution metric can be used to calculate the desired mipmap level based on the position of the camera.
            * @param $uvSetIndex UV set index to return the UV distibution metric for. 0 for first.
            * @returns Average of triangle area / uv area. 
            */
            public GetUVDistributionMetric ($uvSetIndex: number) : number
            public GetVertices ($vertices: System.Collections.Generic.List$1<UnityEngine.Vector3>) : void
            public SetVertices ($inVertices: System.Collections.Generic.List$1<UnityEngine.Vector3>) : void
            public SetVertices ($inVertices: System.Collections.Generic.List$1<UnityEngine.Vector3>, $start: number, $length: number) : void
            public SetVertices ($inVertices: System.Collections.Generic.List$1<UnityEngine.Vector3>, $start: number, $length: number, $flags: UnityEngine.Rendering.MeshUpdateFlags) : void
            /** Assigns a new vertex positions array.
            * @param $inVertices Per-vertex positions.
            */
            public SetVertices ($inVertices: System.Array$1<UnityEngine.Vector3>) : void
            /** Sets the vertex positions of the Mesh, using a part of the input array.
            * @param $inVertices Per-vertex positions.
            * @param $start Index of the first element to take from the input array.
            * @param $length Number of elements to take from the input array.
            * @param $flags Flags controlling the function behavior, see MeshUpdateFlags.
            */
            public SetVertices ($inVertices: System.Array$1<UnityEngine.Vector3>, $start: number, $length: number) : void
            /** Sets the vertex positions of the Mesh, using a part of the input array.
            * @param $inVertices Per-vertex positions.
            * @param $start Index of the first element to take from the input array.
            * @param $length Number of elements to take from the input array.
            * @param $flags Flags controlling the function behavior, see MeshUpdateFlags.
            */
            public SetVertices ($inVertices: System.Array$1<UnityEngine.Vector3>, $start: number, $length: number, $flags: UnityEngine.Rendering.MeshUpdateFlags) : void
            public GetNormals ($normals: System.Collections.Generic.List$1<UnityEngine.Vector3>) : void
            public SetNormals ($inNormals: System.Collections.Generic.List$1<UnityEngine.Vector3>) : void
            public SetNormals ($inNormals: System.Collections.Generic.List$1<UnityEngine.Vector3>, $start: number, $length: number) : void
            public SetNormals ($inNormals: System.Collections.Generic.List$1<UnityEngine.Vector3>, $start: number, $length: number, $flags: UnityEngine.Rendering.MeshUpdateFlags) : void
            /** Set the normals of the Mesh.
            * @param $inNormals Per-vertex normals.
            */
            public SetNormals ($inNormals: System.Array$1<UnityEngine.Vector3>) : void
            /** Sets the vertex normals of the Mesh, using a part of the input array.
            * @param $inNormals Per-vertex normals.
            * @param $start Index of the first element to take from the input array.
            * @param $length Number of elements to take from the input array.
            * @param $flags Flags controlling the function behavior, see MeshUpdateFlags.
            */
            public SetNormals ($inNormals: System.Array$1<UnityEngine.Vector3>, $start: number, $length: number) : void
            /** Sets the vertex normals of the Mesh, using a part of the input array.
            * @param $inNormals Per-vertex normals.
            * @param $start Index of the first element to take from the input array.
            * @param $length Number of elements to take from the input array.
            * @param $flags Flags controlling the function behavior, see MeshUpdateFlags.
            */
            public SetNormals ($inNormals: System.Array$1<UnityEngine.Vector3>, $start: number, $length: number, $flags: UnityEngine.Rendering.MeshUpdateFlags) : void
            public GetTangents ($tangents: System.Collections.Generic.List$1<UnityEngine.Vector4>) : void
            public SetTangents ($inTangents: System.Collections.Generic.List$1<UnityEngine.Vector4>) : void
            public SetTangents ($inTangents: System.Collections.Generic.List$1<UnityEngine.Vector4>, $start: number, $length: number) : void
            public SetTangents ($inTangents: System.Collections.Generic.List$1<UnityEngine.Vector4>, $start: number, $length: number, $flags: UnityEngine.Rendering.MeshUpdateFlags) : void
            /** Set the tangents of the Mesh.
            * @param $inTangents Per-vertex tangents.
            */
            public SetTangents ($inTangents: System.Array$1<UnityEngine.Vector4>) : void
            /** Sets the tangents of the Mesh, using a part of the input array.
            * @param $inTangents Per-vertex tangents.
            * @param $start Index of the first element to take from the input array.
            * @param $length Number of elements to take from the input array.
            * @param $flags Flags controlling the function behavior, see MeshUpdateFlags.
            */
            public SetTangents ($inTangents: System.Array$1<UnityEngine.Vector4>, $start: number, $length: number) : void
            /** Sets the tangents of the Mesh, using a part of the input array.
            * @param $inTangents Per-vertex tangents.
            * @param $start Index of the first element to take from the input array.
            * @param $length Number of elements to take from the input array.
            * @param $flags Flags controlling the function behavior, see MeshUpdateFlags.
            */
            public SetTangents ($inTangents: System.Array$1<UnityEngine.Vector4>, $start: number, $length: number, $flags: UnityEngine.Rendering.MeshUpdateFlags) : void
            public GetColors ($colors: System.Collections.Generic.List$1<UnityEngine.Color>) : void
            public SetColors ($inColors: System.Collections.Generic.List$1<UnityEngine.Color>) : void
            public SetColors ($inColors: System.Collections.Generic.List$1<UnityEngine.Color>, $start: number, $length: number) : void
            public SetColors ($inColors: System.Collections.Generic.List$1<UnityEngine.Color>, $start: number, $length: number, $flags: UnityEngine.Rendering.MeshUpdateFlags) : void
            /** Set the per-vertex colors of the Mesh.
            * @param $inColors Per-vertex colors.
            */
            public SetColors ($inColors: System.Array$1<UnityEngine.Color>) : void
            /** Sets the per-vertex colors of the Mesh, using a part of the input array.
            * @param $inColors Per-vertex colors.
            * @param $start Index of the first element to take from the input array.
            * @param $length Number of elements to take from the input array.
            * @param $flags Flags controlling the function behavior, see MeshUpdateFlags.
            */
            public SetColors ($inColors: System.Array$1<UnityEngine.Color>, $start: number, $length: number) : void
            /** Sets the per-vertex colors of the Mesh, using a part of the input array.
            * @param $inColors Per-vertex colors.
            * @param $start Index of the first element to take from the input array.
            * @param $length Number of elements to take from the input array.
            * @param $flags Flags controlling the function behavior, see MeshUpdateFlags.
            */
            public SetColors ($inColors: System.Array$1<UnityEngine.Color>, $start: number, $length: number, $flags: UnityEngine.Rendering.MeshUpdateFlags) : void
            public GetColors ($colors: System.Collections.Generic.List$1<UnityEngine.Color32>) : void
            public SetColors ($inColors: System.Collections.Generic.List$1<UnityEngine.Color32>) : void
            public SetColors ($inColors: System.Collections.Generic.List$1<UnityEngine.Color32>, $start: number, $length: number) : void
            public SetColors ($inColors: System.Collections.Generic.List$1<UnityEngine.Color32>, $start: number, $length: number, $flags: UnityEngine.Rendering.MeshUpdateFlags) : void
            /** Set the per-vertex colors of the Mesh.
            * @param $inColors Per-vertex colors.
            */
            public SetColors ($inColors: System.Array$1<UnityEngine.Color32>) : void
            /** Sets the per-vertex colors of the Mesh, using a part of the input array.
            * @param $inColors Per-vertex colors.
            * @param $start Index of the first element to take from the input array.
            * @param $length Number of elements to take from the input array.
            * @param $flags Flags controlling the function behavior, see MeshUpdateFlags.
            */
            public SetColors ($inColors: System.Array$1<UnityEngine.Color32>, $start: number, $length: number) : void
            /** Sets the per-vertex colors of the Mesh, using a part of the input array.
            * @param $inColors Per-vertex colors.
            * @param $start Index of the first element to take from the input array.
            * @param $length Number of elements to take from the input array.
            * @param $flags Flags controlling the function behavior, see MeshUpdateFlags.
            */
            public SetColors ($inColors: System.Array$1<UnityEngine.Color32>, $start: number, $length: number, $flags: UnityEngine.Rendering.MeshUpdateFlags) : void
            public SetUVs ($channel: number, $uvs: System.Collections.Generic.List$1<UnityEngine.Vector2>) : void
            public SetUVs ($channel: number, $uvs: System.Collections.Generic.List$1<UnityEngine.Vector3>) : void
            public SetUVs ($channel: number, $uvs: System.Collections.Generic.List$1<UnityEngine.Vector4>) : void
            public SetUVs ($channel: number, $uvs: System.Collections.Generic.List$1<UnityEngine.Vector2>, $start: number, $length: number) : void
            public SetUVs ($channel: number, $uvs: System.Collections.Generic.List$1<UnityEngine.Vector2>, $start: number, $length: number, $flags: UnityEngine.Rendering.MeshUpdateFlags) : void
            public SetUVs ($channel: number, $uvs: System.Collections.Generic.List$1<UnityEngine.Vector3>, $start: number, $length: number) : void
            public SetUVs ($channel: number, $uvs: System.Collections.Generic.List$1<UnityEngine.Vector3>, $start: number, $length: number, $flags: UnityEngine.Rendering.MeshUpdateFlags) : void
            public SetUVs ($channel: number, $uvs: System.Collections.Generic.List$1<UnityEngine.Vector4>, $start: number, $length: number) : void
            public SetUVs ($channel: number, $uvs: System.Collections.Generic.List$1<UnityEngine.Vector4>, $start: number, $length: number, $flags: UnityEngine.Rendering.MeshUpdateFlags) : void
            /** Sets the texture coordinates (UVs) stored in a given channel.
            * @param $channel The channel, in [0..7] range.
            * @param $uvs The UV data to set.
            */
            public SetUVs ($channel: number, $uvs: System.Array$1<UnityEngine.Vector2>) : void
            /** Sets the texture coordinates (UVs) stored in a given channel.
            * @param $channel The channel, in [0..7] range.
            * @param $uvs The UV data to set.
            */
            public SetUVs ($channel: number, $uvs: System.Array$1<UnityEngine.Vector3>) : void
            /** Sets the texture coordinates (UVs) stored in a given channel.
            * @param $channel The channel, in [0..7] range.
            * @param $uvs The UV data to set.
            */
            public SetUVs ($channel: number, $uvs: System.Array$1<UnityEngine.Vector4>) : void
            /** Sets the UVs of the Mesh, using a part of the input array.
            * @param $channel The UV channel, in [0..7] range.
            * @param $uvs UVs to set for the given index.
            * @param $start Index of the first element to take from the input array.
            * @param $length Number of elements to take from the input array.
            * @param $flags Flags controlling the function behavior, see MeshUpdateFlags.
            */
            public SetUVs ($channel: number, $uvs: System.Array$1<UnityEngine.Vector2>, $start: number, $length: number) : void
            /** Sets the UVs of the Mesh, using a part of the input array.
            * @param $channel The UV channel, in [0..7] range.
            * @param $uvs UVs to set for the given index.
            * @param $start Index of the first element to take from the input array.
            * @param $length Number of elements to take from the input array.
            * @param $flags Flags controlling the function behavior, see MeshUpdateFlags.
            */
            public SetUVs ($channel: number, $uvs: System.Array$1<UnityEngine.Vector2>, $start: number, $length: number, $flags: UnityEngine.Rendering.MeshUpdateFlags) : void
            /** Sets the UVs of the Mesh, using a part of the input array.
            * @param $channel The UV channel, in [0..7] range.
            * @param $uvs UVs to set for the given index.
            * @param $start Index of the first element to take from the input array.
            * @param $length Number of elements to take from the input array.
            * @param $flags Flags controlling the function behavior, see MeshUpdateFlags.
            */
            public SetUVs ($channel: number, $uvs: System.Array$1<UnityEngine.Vector3>, $start: number, $length: number) : void
            /** Sets the UVs of the Mesh, using a part of the input array.
            * @param $channel The UV channel, in [0..7] range.
            * @param $uvs UVs to set for the given index.
            * @param $start Index of the first element to take from the input array.
            * @param $length Number of elements to take from the input array.
            * @param $flags Flags controlling the function behavior, see MeshUpdateFlags.
            */
            public SetUVs ($channel: number, $uvs: System.Array$1<UnityEngine.Vector3>, $start: number, $length: number, $flags: UnityEngine.Rendering.MeshUpdateFlags) : void
            /** Sets the UVs of the Mesh, using a part of the input array.
            * @param $channel The UV channel, in [0..7] range.
            * @param $uvs UVs to set for the given index.
            * @param $start Index of the first element to take from the input array.
            * @param $length Number of elements to take from the input array.
            * @param $flags Flags controlling the function behavior, see MeshUpdateFlags.
            */
            public SetUVs ($channel: number, $uvs: System.Array$1<UnityEngine.Vector4>, $start: number, $length: number) : void
            /** Sets the UVs of the Mesh, using a part of the input array.
            * @param $channel The UV channel, in [0..7] range.
            * @param $uvs UVs to set for the given index.
            * @param $start Index of the first element to take from the input array.
            * @param $length Number of elements to take from the input array.
            * @param $flags Flags controlling the function behavior, see MeshUpdateFlags.
            */
            public SetUVs ($channel: number, $uvs: System.Array$1<UnityEngine.Vector4>, $start: number, $length: number, $flags: UnityEngine.Rendering.MeshUpdateFlags) : void
            public GetUVs ($channel: number, $uvs: System.Collections.Generic.List$1<UnityEngine.Vector2>) : void
            public GetUVs ($channel: number, $uvs: System.Collections.Generic.List$1<UnityEngine.Vector3>) : void
            public GetUVs ($channel: number, $uvs: System.Collections.Generic.List$1<UnityEngine.Vector4>) : void
            /** Get information about vertex attributes of a Mesh.
            * @returns Array of vertex attribute information. 
            */
            public GetVertexAttributes () : System.Array$1<UnityEngine.Rendering.VertexAttributeDescriptor>
            /** Get information about vertex attributes of a Mesh, without memory allocations.
            * @param $attributes Collection of vertex attributes to receive the results.
            * @returns The number of vertex attributes returned in the attributes container. 
            */
            public GetVertexAttributes ($attributes: System.Array$1<UnityEngine.Rendering.VertexAttributeDescriptor>) : number
            public GetVertexAttributes ($attributes: System.Collections.Generic.List$1<UnityEngine.Rendering.VertexAttributeDescriptor>) : number
            /** Sets the vertex buffer size and layout.
            * @param $vertexCount The number of vertices in the Mesh.
            * @param $attributes Layout of the vertex data -- which attributes are present, their data types and so on.
            */
            public SetVertexBufferParams ($vertexCount: number, ...attributes: UnityEngine.Rendering.VertexAttributeDescriptor[]) : void
            public SetVertexBufferParams ($vertexCount: number, $attributes: Unity.Collections.NativeArray$1<UnityEngine.Rendering.VertexAttributeDescriptor>) : void
            /** Gets a snapshot of Mesh data for read-only access.
            * @param $mesh The input mesh.
            * @param $meshes The input meshes.
            * @returns Returns a MeshDataArray containing read-only MeshData structs. See Mesh.MeshDataArray and Mesh.MeshData. 
            */
            public static AcquireReadOnlyMeshData ($mesh: UnityEngine.Mesh) : UnityEngine.Mesh.MeshDataArray
            /** Gets a snapshot of Mesh data for read-only access.
            * @param $mesh The input mesh.
            * @param $meshes The input meshes.
            * @returns Returns a MeshDataArray containing read-only MeshData structs. See Mesh.MeshDataArray and Mesh.MeshData. 
            */
            public static AcquireReadOnlyMeshData ($meshes: System.Array$1<UnityEngine.Mesh>) : UnityEngine.Mesh.MeshDataArray
            public static AcquireReadOnlyMeshData ($meshes: System.Collections.Generic.List$1<UnityEngine.Mesh>) : UnityEngine.Mesh.MeshDataArray
            /** Allocates data structures for Mesh creation using C# Jobs.
            * @param $meshCount The amount of meshes that will be created.
            * @returns Returns a MeshDataArray containing writeable MeshData structs. See Mesh.MeshDataArray and Mesh.MeshData. 
            */
            public static AllocateWritableMeshData ($meshCount: number) : UnityEngine.Mesh.MeshDataArray
            public static AllocateWritableMeshData ($mesh: UnityEngine.Mesh) : UnityEngine.Mesh.MeshDataArray
            public static AllocateWritableMeshData ($meshes: System.Array$1<UnityEngine.Mesh>) : UnityEngine.Mesh.MeshDataArray
            public static AllocateWritableMeshData ($meshes: System.Collections.Generic.List$1<UnityEngine.Mesh>) : UnityEngine.Mesh.MeshDataArray
            public static ApplyAndDisposeWritableMeshData ($data: UnityEngine.Mesh.MeshDataArray, $mesh: UnityEngine.Mesh, $flags?: UnityEngine.Rendering.MeshUpdateFlags) : void
            public static ApplyAndDisposeWritableMeshData ($data: UnityEngine.Mesh.MeshDataArray, $meshes: System.Array$1<UnityEngine.Mesh>, $flags?: UnityEngine.Rendering.MeshUpdateFlags) : void
            public static ApplyAndDisposeWritableMeshData ($data: UnityEngine.Mesh.MeshDataArray, $meshes: System.Collections.Generic.List$1<UnityEngine.Mesh>, $flags?: UnityEngine.Rendering.MeshUpdateFlags) : void
            /** Retrieves a GraphicsBuffer that provides direct acces to the GPU vertex buffer.
            * @param $index Vertex data stream index to get the buffer for.
            * @returns The mesh vertex buffer as a GraphicsBuffer. 
            */
            public GetVertexBuffer ($index: number) : UnityEngine.GraphicsBuffer
            /** Retrieves a GraphicsBuffer to the GPU index buffer.
            * @returns The mesh index buffer as a GraphicsBuffer. 
            */
            public GetIndexBuffer () : UnityEngine.GraphicsBuffer
            /** Retrieves a GraphicsBuffer that provides direct read and write access to GPU bone weight data.
            * @param $layout Which buffer to access, based on maximum bones per vertex.
            * @returns The bone weight data as a GraphicsBuffer. 
            */
            public GetBoneWeightBuffer ($layout: UnityEngine.SkinWeights) : UnityEngine.GraphicsBuffer
            /** Retrieves a GraphicsBuffer that provides direct read and write access to GPU blend shape vertex data.
            * @param $layout Which buffer to access. The default value is Rendering.BlendShapeBufferLayout.PerShape.
            * @returns The blend shape vertex data as a GraphicsBuffer. 
            */
            public GetBlendShapeBuffer ($layout: UnityEngine.Rendering.BlendShapeBufferLayout) : UnityEngine.GraphicsBuffer
            /** Retrieves a GraphicsBuffer that provides direct read and write access to GPU blend shape vertex data.
            * @param $layout Which buffer to access. The default value is Rendering.BlendShapeBufferLayout.PerShape.
            * @returns The blend shape vertex data as a GraphicsBuffer. 
            */
            public GetBlendShapeBuffer () : UnityEngine.GraphicsBuffer
            /** Get the location of blend shape vertex data for a given blend shape.
            * @param $blendShapeIndex Which blend shape to locate the data for.
            * @returns A struct that describes the start and end index of the data for the given blend shape. 
            */
            public GetBlendShapeBufferRange ($blendShapeIndex: number) : UnityEngine.BlendShapeBufferRange
            /** Fetches the triangle list for the specified sub-mesh on this object.
            * @param $triangles A list of vertex indices to populate. Any existing items in the list are replaced.
            * @param $submesh The sub-mesh index. See subMeshCount.
            * @param $applyBaseVertex True (default value) will apply base vertex offset to returned indices.
            */
            public GetTriangles ($submesh: number) : System.Array$1<number>
            /** Fetches the triangle list for the specified sub-mesh on this object.
            * @param $triangles A list of vertex indices to populate. Any existing items in the list are replaced.
            * @param $submesh The sub-mesh index. See subMeshCount.
            * @param $applyBaseVertex True (default value) will apply base vertex offset to returned indices.
            */
            public GetTriangles ($submesh: number, $applyBaseVertex: boolean) : System.Array$1<number>
            public GetTriangles ($triangles: System.Collections.Generic.List$1<number>, $submesh: number) : void
            public GetTriangles ($triangles: System.Collections.Generic.List$1<number>, $submesh: number, $applyBaseVertex: boolean) : void
            public GetTriangles ($triangles: System.Collections.Generic.List$1<number>, $submesh: number, $applyBaseVertex?: boolean) : void
            /** Fetches the index list for the specified sub-mesh.
            * @param $submesh The sub-mesh index. See subMeshCount.
            * @param $applyBaseVertex True (default value) will apply base vertex offset to returned indices.
            * @returns Array with face indices. 
            */
            public GetIndices ($submesh: number) : System.Array$1<number>
            /** Fetches the index list for the specified sub-mesh.
            * @param $submesh The sub-mesh index. See subMeshCount.
            * @param $applyBaseVertex True (default value) will apply base vertex offset to returned indices.
            * @returns Array with face indices. 
            */
            public GetIndices ($submesh: number, $applyBaseVertex: boolean) : System.Array$1<number>
            public GetIndices ($indices: System.Collections.Generic.List$1<number>, $submesh: number) : void
            public GetIndices ($indices: System.Collections.Generic.List$1<number>, $submesh: number, $applyBaseVertex: boolean) : void
            public GetIndices ($indices: System.Collections.Generic.List$1<number>, $submesh: number, $applyBaseVertex?: boolean) : void
            /** Gets the starting index location within the Mesh's index buffer, for the given sub-mesh.
            */
            public GetIndexStart ($submesh: number) : number
            /** Gets the index count of the given sub-mesh.
            */
            public GetIndexCount ($submesh: number) : number
            /** Gets the base vertex index of the given sub-mesh.
            * @param $submesh The sub-mesh index. See subMeshCount.
            * @returns The offset applied to all vertex indices of this sub-mesh. 
            */
            public GetBaseVertex ($submesh: number) : number
            /** Sets the triangle list for the sub-mesh.
            * @param $triangles The list of indices that define the triangles.
            * @param $submesh The sub-mesh to modify.
            * @param $calculateBounds Calculate the bounding box of the Mesh after setting the triangles. This is done by default.
            Use false when you want to use the existing bounding box and reduce the CPU cost of setting the triangles.
            * @param $baseVertex Optional vertex offset that is added to all triangle vertex indices.
            */
            public SetTriangles ($triangles: System.Array$1<number>, $submesh: number) : void
            /** Sets the triangle list for the sub-mesh.
            * @param $triangles The list of indices that define the triangles.
            * @param $submesh The sub-mesh to modify.
            * @param $calculateBounds Calculate the bounding box of the Mesh after setting the triangles. This is done by default.
            Use false when you want to use the existing bounding box and reduce the CPU cost of setting the triangles.
            * @param $baseVertex Optional vertex offset that is added to all triangle vertex indices.
            */
            public SetTriangles ($triangles: System.Array$1<number>, $submesh: number, $calculateBounds: boolean) : void
            /** Sets the triangle list for the sub-mesh.
            * @param $triangles The list of indices that define the triangles.
            * @param $submesh The sub-mesh to modify.
            * @param $calculateBounds Calculate the bounding box of the Mesh after setting the triangles. This is done by default.
            Use false when you want to use the existing bounding box and reduce the CPU cost of setting the triangles.
            * @param $baseVertex Optional vertex offset that is added to all triangle vertex indices.
            */
            public SetTriangles ($triangles: System.Array$1<number>, $submesh: number, $calculateBounds: boolean, $baseVertex: number) : void
            /** Sets the triangle list of the Mesh, using a part of the input array.
            * @param $triangles The list of indices that define the triangles.
            * @param $trianglesStart Index of the first element to take from the input array.
            * @param $trianglesLength Number of elements to take from the input array.
            * @param $submesh The sub-mesh to modify.
            * @param $calculateBounds Calculate the bounding box of the Mesh after setting the triangles. This is done by default.
            Use false when you want to use the existing bounding box and reduce the CPU cost of setting the triangles.
            * @param $baseVertex Optional vertex offset that is added to all triangle vertex indices.
            */
            public SetTriangles ($triangles: System.Array$1<number>, $trianglesStart: number, $trianglesLength: number, $submesh: number, $calculateBounds?: boolean, $baseVertex?: number) : void
            /** Sets the triangle list for the sub-mesh.
            * @param $triangles The list of indices that define the triangles.
            * @param $submesh The sub-mesh to modify.
            * @param $calculateBounds Calculate the bounding box of the Mesh after setting the triangles. This is done by default.
            Use false when you want to use the existing bounding box and reduce the CPU cost of setting the triangles.
            * @param $baseVertex Optional vertex offset that is added to all triangle vertex indices.
            */
            public SetTriangles ($triangles: System.Array$1<number>, $submesh: number, $calculateBounds?: boolean, $baseVertex?: number) : void
            public SetTriangles ($triangles: System.Collections.Generic.List$1<number>, $submesh: number) : void
            public SetTriangles ($triangles: System.Collections.Generic.List$1<number>, $submesh: number, $calculateBounds: boolean) : void
            public SetTriangles ($triangles: System.Collections.Generic.List$1<number>, $submesh: number, $calculateBounds: boolean, $baseVertex: number) : void
            public SetTriangles ($triangles: System.Collections.Generic.List$1<number>, $trianglesStart: number, $trianglesLength: number, $submesh: number, $calculateBounds?: boolean, $baseVertex?: number) : void
            public SetTriangles ($triangles: System.Collections.Generic.List$1<number>, $submesh: number, $calculateBounds?: boolean, $baseVertex?: number) : void
            /** Sets the index buffer for the sub-mesh.
            * @param $indices The array of indices that define the mesh faces.
            * @param $topology The topology of the Mesh, e.g: Triangles, Lines, Quads, Points, etc. See MeshTopology.
            * @param $submesh The sub-mesh to modify.
            * @param $calculateBounds Calculate the bounding box of the sub-mesh after setting the indices. Unity does this by default.
            Use false when you want to use the existing bounding box and reduce the CPU cost of setting the indices.
            * @param $baseVertex Optional vertex offset that is added to all vertex indices.
            */
            public SetIndices ($indices: System.Array$1<number>, $topology: UnityEngine.MeshTopology, $submesh: number) : void
            /** Sets the index buffer for the sub-mesh.
            * @param $indices The array of indices that define the mesh faces.
            * @param $topology The topology of the Mesh, e.g: Triangles, Lines, Quads, Points, etc. See MeshTopology.
            * @param $submesh The sub-mesh to modify.
            * @param $calculateBounds Calculate the bounding box of the sub-mesh after setting the indices. Unity does this by default.
            Use false when you want to use the existing bounding box and reduce the CPU cost of setting the indices.
            * @param $baseVertex Optional vertex offset that is added to all vertex indices.
            */
            public SetIndices ($indices: System.Array$1<number>, $topology: UnityEngine.MeshTopology, $submesh: number, $calculateBounds: boolean) : void
            /** Sets the index buffer for the sub-mesh.
            * @param $indices The array of indices that define the mesh faces.
            * @param $topology The topology of the Mesh, e.g: Triangles, Lines, Quads, Points, etc. See MeshTopology.
            * @param $submesh The sub-mesh to modify.
            * @param $calculateBounds Calculate the bounding box of the sub-mesh after setting the indices. Unity does this by default.
            Use false when you want to use the existing bounding box and reduce the CPU cost of setting the indices.
            * @param $baseVertex Optional vertex offset that is added to all vertex indices.
            */
            public SetIndices ($indices: System.Array$1<number>, $topology: UnityEngine.MeshTopology, $submesh: number, $calculateBounds: boolean, $baseVertex: number) : void
            /** Sets the index buffer of a sub-mesh, using a part of the input array.
            * @param $indices The array of indices that define the mesh faces.
            * @param $indicesStart Index of the first element to take from the input array.
            * @param $indicesLength Number of elements to take from the input array.
            * @param $topology The topology of the Mesh, e.g: Triangles, Lines, Quads, Points, etc. See MeshTopology.
            * @param $submesh The sub-mesh to modify.
            * @param $calculateBounds Calculate the bounding box of the sub-mesh after setting the indices. Unity does this by default.
            Use false when you want to use the existing bounding box and reduce the CPU cost of setting the indices.
            * @param $baseVertex Optional vertex offset that is added to all vertex indices.
            */
            public SetIndices ($indices: System.Array$1<number>, $indicesStart: number, $indicesLength: number, $topology: UnityEngine.MeshTopology, $submesh: number, $calculateBounds?: boolean, $baseVertex?: number) : void
            /** Sets the index buffer for the sub-mesh.
            * @param $indices The array of indices that define the mesh faces.
            * @param $topology The topology of the Mesh, e.g: Triangles, Lines, Quads, Points, etc. See MeshTopology.
            * @param $submesh The sub-mesh to modify.
            * @param $calculateBounds Calculate the bounding box of the sub-mesh after setting the indices. Unity does this by default.
            Use false when you want to use the existing bounding box and reduce the CPU cost of setting the indices.
            * @param $baseVertex Optional vertex offset that is added to all vertex indices.
            */
            public SetIndices ($indices: System.Array$1<number>, $topology: UnityEngine.MeshTopology, $submesh: number, $calculateBounds?: boolean, $baseVertex?: number) : void
            public SetIndices ($indices: System.Collections.Generic.List$1<number>, $topology: UnityEngine.MeshTopology, $submesh: number, $calculateBounds?: boolean, $baseVertex?: number) : void
            public SetIndices ($indices: System.Collections.Generic.List$1<number>, $indicesStart: number, $indicesLength: number, $topology: UnityEngine.MeshTopology, $submesh: number, $calculateBounds?: boolean, $baseVertex?: number) : void
            /** Sets information defining all sub-meshes in this Mesh, replacing any existing sub-meshes.
            * @param $desc An array or list of sub-mesh data descriptors.
            * @param $start Index of the first element to take from the array or list in desc.
            * @param $count Number of elements to take from the array or list in desc.
            * @param $flags (Optional) Flags controlling the function behavior, see MeshUpdateFlags.
            */
            public SetSubMeshes ($desc: System.Array$1<UnityEngine.Rendering.SubMeshDescriptor>, $start: number, $count: number, $flags?: UnityEngine.Rendering.MeshUpdateFlags) : void
            /** Sets information defining all sub-meshes in this Mesh, replacing any existing sub-meshes.
            * @param $desc An array or list of sub-mesh data descriptors.
            * @param $start Index of the first element to take from the array or list in desc.
            * @param $count Number of elements to take from the array or list in desc.
            * @param $flags (Optional) Flags controlling the function behavior, see MeshUpdateFlags.
            */
            public SetSubMeshes ($desc: System.Array$1<UnityEngine.Rendering.SubMeshDescriptor>, $flags?: UnityEngine.Rendering.MeshUpdateFlags) : void
            public SetSubMeshes ($desc: System.Collections.Generic.List$1<UnityEngine.Rendering.SubMeshDescriptor>, $start: number, $count: number, $flags?: UnityEngine.Rendering.MeshUpdateFlags) : void
            public SetSubMeshes ($desc: System.Collections.Generic.List$1<UnityEngine.Rendering.SubMeshDescriptor>, $flags?: UnityEngine.Rendering.MeshUpdateFlags) : void
            public GetBindposes ($bindposes: System.Collections.Generic.List$1<UnityEngine.Matrix4x4>) : void
            public GetBoneWeights ($boneWeights: System.Collections.Generic.List$1<UnityEngine.BoneWeight>) : void
            /** Clears all vertex data and all triangle indices.
            * @param $keepVertexLayout True if the existing Mesh data layout should be preserved.
            */
            public Clear ($keepVertexLayout: boolean) : void
            public Clear () : void
            public RecalculateBounds () : void
            public RecalculateNormals () : void
            public RecalculateTangents () : void
            /** Recalculate the bounding volume of the Mesh and all of its sub-meshes with the vertex data.
            * @param $flags Flags controlling the function behavior, see MeshUpdateFlags.
            */
            public RecalculateBounds ($flags: UnityEngine.Rendering.MeshUpdateFlags) : void
            /** Recalculates the normals of the Mesh from the triangles and vertices.
            * @param $flags Flags controlling the function behavior, see MeshUpdateFlags.
            */
            public RecalculateNormals ($flags: UnityEngine.Rendering.MeshUpdateFlags) : void
            /** Recalculates the tangents of the Mesh from the normals and texture coordinates.
            * @param $flags Flags controlling the function behavior, see MeshUpdateFlags.
            */
            public RecalculateTangents ($flags: UnityEngine.Rendering.MeshUpdateFlags) : void
            /** Recalculates the UV distribution metric of the Mesh from the vertices and uv coordinates.
            * @param $uvSetIndex The UV set index to set the UV distibution metric for. Use 0 for first index.
            * @param $uvAreaThreshold The minimum UV area to consider. The default value is 1e-9f.
            */
            public RecalculateUVDistributionMetric ($uvSetIndex: number, $uvAreaThreshold?: number) : void
            /** Recalculates the UV distribution metrics of the Mesh from the vertices and uv coordinates.
            * @param $uvAreaThreshold The minimum UV area to consider. The default value is 1e-9f.
            */
            public RecalculateUVDistributionMetrics ($uvAreaThreshold?: number) : void
            /** Optimize mesh for frequent updates.
            */
            public MarkDynamic () : void
            /** Upload previously done Mesh modifications to the graphics API.
            * @param $markNoLongerReadable Frees up system memory copy of mesh data when set to true.
            */
            public UploadMeshData ($markNoLongerReadable: boolean) : void
            /** Optimizes the Mesh data to improve rendering performance.
            */
            public Optimize () : void
            /** Optimizes the geometry of the Mesh to improve rendering performance.
            */
            public OptimizeIndexBuffers () : void
            /** Optimizes the vertices of the Mesh to improve rendering performance.
            */
            public OptimizeReorderVertexBuffer () : void
            /** Gets the topology of a sub-mesh.
            */
            public GetTopology ($submesh: number) : UnityEngine.MeshTopology
            /** Combines several Meshes into this Mesh.
            * @param $combine Descriptions of the Meshes to combine.
            * @param $mergeSubMeshes Defines whether Meshes should be combined into a single sub-mesh.
            * @param $useMatrices Defines whether the transforms supplied in the CombineInstance array should be used or ignored.
            * @param $hasLightmapData Defines whether to transform the input Mesh lightmap UV data using the lightmap scale offset data in CombineInstance structs.
            */
            public CombineMeshes ($combine: System.Array$1<UnityEngine.CombineInstance>, $mergeSubMeshes: boolean, $useMatrices: boolean, $hasLightmapData: boolean) : void
            /** Combines several Meshes into this Mesh.
            * @param $combine Descriptions of the Meshes to combine.
            * @param $mergeSubMeshes Defines whether Meshes should be combined into a single sub-mesh.
            * @param $useMatrices Defines whether the transforms supplied in the CombineInstance array should be used or ignored.
            * @param $hasLightmapData Defines whether to transform the input Mesh lightmap UV data using the lightmap scale offset data in CombineInstance structs.
            */
            public CombineMeshes ($combine: System.Array$1<UnityEngine.CombineInstance>, $mergeSubMeshes: boolean, $useMatrices: boolean) : void
            /** Combines several Meshes into this Mesh.
            * @param $combine Descriptions of the Meshes to combine.
            * @param $mergeSubMeshes Defines whether Meshes should be combined into a single sub-mesh.
            * @param $useMatrices Defines whether the transforms supplied in the CombineInstance array should be used or ignored.
            * @param $hasLightmapData Defines whether to transform the input Mesh lightmap UV data using the lightmap scale offset data in CombineInstance structs.
            */
            public CombineMeshes ($combine: System.Array$1<UnityEngine.CombineInstance>, $mergeSubMeshes: boolean) : void
            /** Combines several Meshes into this Mesh.
            * @param $combine Descriptions of the Meshes to combine.
            * @param $mergeSubMeshes Defines whether Meshes should be combined into a single sub-mesh.
            * @param $useMatrices Defines whether the transforms supplied in the CombineInstance array should be used or ignored.
            * @param $hasLightmapData Defines whether to transform the input Mesh lightmap UV data using the lightmap scale offset data in CombineInstance structs.
            */
            public CombineMeshes ($combine: System.Array$1<UnityEngine.CombineInstance>) : void
            public constructor ()
        }
        /** Represents a Gradient used for animating colors.
        */
        class Gradient extends System.Object implements System.IEquatable$1<UnityEngine.Gradient>
        {
            protected [__keep_incompatibility]: never;
        }
        /** Renders meshes inserted by the MeshFilter or TextMesh.
        */
        class MeshRenderer extends UnityEngine.Renderer
        {
            protected [__keep_incompatibility]: never;
            /** Vertex attributes in this mesh will override or add attributes of the primary mesh in the MeshRenderer.
            */
            public get additionalVertexStreams(): UnityEngine.Mesh;
            public set additionalVertexStreams(value: UnityEngine.Mesh);
            /** Vertex attributes that override the primary mesh when the MeshRenderer uses lightmaps in the Realtime Global Illumination system.
            */
            public get enlightenVertexStream(): UnityEngine.Mesh;
            public set enlightenVertexStream(value: UnityEngine.Mesh);
            /** Index of the first sub-mesh to use from the Mesh associated with this MeshRenderer (Read Only).
            */
            public get subMeshStartIndex(): number;
            /** Specifies the relative lightmap resolution of this object. (Editor only)
            */
            public get scaleInLightmap(): number;
            public set scaleInLightmap(value: number);
            /** Determines how the object will receive global illumination. (Editor only)
            */
            public get receiveGI(): UnityEngine.ReceiveGI;
            public set receiveGI(value: UnityEngine.ReceiveGI);
            /** When enabled, seams in baked lightmaps will get smoothed. (Editor only)
            */
            public get stitchLightmapSeams(): boolean;
            public set stitchLightmapSeams(value: boolean);
            public constructor ()
        }
        /** This property only takes effect if you enable a global illumination setting such as for the GameObject associated with the target Mesh Renderer. Otherwise this property defaults to the Light Probes setting.
        */
        enum ReceiveGI
        { Lightmaps = 1, LightProbes = 2 }
        /** The Skinned Mesh filter.
        */
        class SkinnedMeshRenderer extends UnityEngine.Renderer
        {
            protected [__keep_incompatibility]: never;
            /** The maximum number of bones per vertex that are taken into account during skinning.
            */
            public get quality(): UnityEngine.SkinQuality;
            public set quality(value: UnityEngine.SkinQuality);
            /** If enabled, the Skinned Mesh will be updated when offscreen. If disabled, this also disables updating animations.
            */
            public get updateWhenOffscreen(): boolean;
            public set updateWhenOffscreen(value: boolean);
            /** Forces the Skinned Mesh to recalculate its matricies when rendered
            */
            public get forceMatrixRecalculationPerRender(): boolean;
            public set forceMatrixRecalculationPerRender(value: boolean);
            public get rootBone(): UnityEngine.Transform;
            public set rootBone(value: UnityEngine.Transform);
            /** The bones used to skin the mesh.
            */
            public get bones(): System.Array$1<UnityEngine.Transform>;
            public set bones(value: System.Array$1<UnityEngine.Transform>);
            /** The mesh used for skinning.
            */
            public get sharedMesh(): UnityEngine.Mesh;
            public set sharedMesh(value: UnityEngine.Mesh);
            /** Specifies whether skinned motion vectors should be used for this renderer.
            */
            public get skinnedMotionVectors(): boolean;
            public set skinnedMotionVectors(value: boolean);
            /** The intended target usage of the skinned mesh GPU vertex buffer.
            */
            public get vertexBufferTarget(): UnityEngine.GraphicsBuffer.Target;
            public set vertexBufferTarget(value: UnityEngine.GraphicsBuffer.Target);
            /** Returns the weight of a BlendShape for this Renderer.
            * @param $index The index of the BlendShape whose weight you want to retrieve. Index must be smaller than the Mesh.blendShapeCount of the Mesh attached to this Renderer.
            * @returns The weight of the BlendShape. 
            */
            public GetBlendShapeWeight ($index: number) : number
            /** Sets the weight of a BlendShape for this Renderer.
            * @param $index The index of the BlendShape to modify. Index must be smaller than the Mesh.blendShapeCount of the Mesh attached to this Renderer.
            * @param $value The weight for this BlendShape.
            */
            public SetBlendShapeWeight ($index: number, $value: number) : void
            /** Creates a snapshot of SkinnedMeshRenderer and stores it in mesh.
            * @param $mesh A static mesh that will receive the snapshot of the skinned mesh.
            * @param $useScale Whether to compensate for the SkinnedMeshRenderer's Transform scale. If true, the baked Mesh is the same size as the original. If false, the baked Mesh matches the scaling of the SkinnedMeshRenderer's Transform component. The default value is false.
            */
            public BakeMesh ($mesh: UnityEngine.Mesh) : void
            /** Creates a snapshot of SkinnedMeshRenderer and stores it in mesh.
            * @param $mesh A static mesh that will receive the snapshot of the skinned mesh.
            * @param $useScale Whether to compensate for the SkinnedMeshRenderer's Transform scale. If true, the baked Mesh is the same size as the original. If false, the baked Mesh matches the scaling of the SkinnedMeshRenderer's Transform component. The default value is false.
            */
            public BakeMesh ($mesh: UnityEngine.Mesh, $useScale: boolean) : void
            /** Retrieves a GraphicsBuffer that provides direct access to the GPU vertex buffer for this skinned mesh, for the current frame.
            * @returns The skinned mesh vertex buffer as a GraphicsBuffer. 
            */
            public GetVertexBuffer () : UnityEngine.GraphicsBuffer
            /** Retrieves a GraphicsBuffer that provides direct access to the GPU vertex buffer for this skinned mesh, for the previous frame.
            * @returns The skinned mesh vertex buffer as a GraphicsBuffer. 
            */
            public GetPreviousVertexBuffer () : UnityEngine.GraphicsBuffer
            public constructor ()
        }
        /** The maximum number of bones affecting a single vertex.
        */
        enum SkinQuality
        { Auto = 0, Bone1 = 1, Bone2 = 2, Bone4 = 4 }
        /** GPU graphics data buffer, for working with geometry or compute shader data.
        */
        class GraphicsBuffer extends System.Object implements System.IDisposable
        {
            protected [__keep_incompatibility]: never;
        }
        /** How the material interacts with lightmaps and lightprobes.
        */
        enum MaterialGlobalIlluminationFlags
        { None = 0, RealtimeEmissive = 1, BakedEmissive = 2, EmissiveIsBlack = 4, AnyEmissive = 3 }
        /** GPU data buffer, mostly for use with compute shaders.
        */
        class ComputeBuffer extends System.Object implements System.IDisposable
        {
            protected [__keep_incompatibility]: never;
        }
        /** Represents the internal handle/id of a GraphicsBuffer.
        */
        class GraphicsBufferHandle extends System.ValueType implements System.IEquatable$1<UnityEngine.GraphicsBufferHandle>
        {
            protected [__keep_incompatibility]: never;
        }
        /** The type of a given material property.
        */
        enum MaterialPropertyType
        { Float = 0, Int = 1, Vector = 2, Matrix = 3, Texture = 4, ConstantBuffer = 5, ComputeBuffer = 6 }
        /** Describes a bone weight that affects a vertex in a mesh.
        */
        class BoneWeight1 extends System.ValueType implements System.IEquatable$1<UnityEngine.BoneWeight1>
        {
            protected [__keep_incompatibility]: never;
        }
        /** Skin weights.
        */
        enum SkinWeights
        { None = 0, OneBone = 1, TwoBones = 2, FourBones = 4, Unlimited = 255 }
        /** Describes the location of blend shape vertex data in a GraphicsBuffer.
        */
        class BlendShapeBufferRange extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        /** Topology of Mesh faces.
        */
        enum MeshTopology
        { Triangles = 0, Quads = 2, Lines = 3, LineStrip = 4, Points = 5 }
        /** Describes 4 skinning bone weights that affect a vertex in a mesh.
        */
        class BoneWeight extends System.ValueType implements System.IEquatable$1<UnityEngine.BoneWeight>
        {
            protected [__keep_incompatibility]: never;
        }
        /** Struct used to describe meshes to be combined using Mesh.CombineMeshes.
        */
        class CombineInstance extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        /** A class to access the Mesh of the.
        */
        class MeshFilter extends UnityEngine.Component
        {
            protected [__keep_incompatibility]: never;
            /** Returns the shared mesh of the mesh filter.
            */
            public get sharedMesh(): UnityEngine.Mesh;
            public set sharedMesh(value: UnityEngine.Mesh);
            /** Returns either a new Mesh|mesh or a duplicate of the existing mesh, and assigns it to the mesh filter.
            */
            public get mesh(): UnityEngine.Mesh;
            public set mesh(value: UnityEngine.Mesh);
            public constructor ()
        }
        /** Script interface for.
        */
        class Light extends UnityEngine.Behaviour
        {
            protected [__keep_incompatibility]: never;
            /** The type of the light.
            */
            public get type(): UnityEngine.LightType;
            public set type(value: UnityEngine.LightType);
            /** The angle of the spot light's cone in degrees.
            */
            public get spotAngle(): number;
            public set spotAngle(value: number);
            /** The angle of the spot light's inner cone in degrees.
            */
            public get innerSpotAngle(): number;
            public set innerSpotAngle(value: number);
            /** The color of the light.
            */
            public get color(): UnityEngine.Color;
            public set color(value: UnityEngine.Color);
            /** 
            The color temperature of the light.
            Correlated Color Temperature (abbreviated as CCT) is multiplied with the color filter when calculating the final color of a light source. The color temperature of the electromagnetic radiation emitted from an ideal black body is defined as its surface temperature in Kelvin. White is 6500K according to the D65 standard. A candle light is 1800K and a soft warm light bulb is 2700K.
            If you want to use colorTemperature, GraphicsSettings.lightsUseLinearIntensity and Light.useColorTemperature has to be enabled.
            Additional resources: GraphicsSettings.lightsUseLinearIntensity, GraphicsSettings.useColorTemperature.
            */
            public get colorTemperature(): number;
            public set colorTemperature(value: number);
            /** Set to true to use the color temperature.
            */
            public get useColorTemperature(): boolean;
            public set useColorTemperature(value: boolean);
            /** The Intensity of a light is multiplied with the Light color.
            */
            public get intensity(): number;
            public set intensity(value: number);
            /** The multiplier that defines the strength of the bounce lighting.
            */
            public get bounceIntensity(): number;
            public set bounceIntensity(value: number);
            /** The unit Light.intensity should be displayed in.
            */
            public get lightUnit(): UnityEngine.Rendering.LightUnit;
            public set lightUnit(value: UnityEngine.Rendering.LightUnit);
            /** How far away to measure LightUnit.Lux from.
            */
            public get luxAtDistance(): number;
            public set luxAtDistance(value: number);
            /** Wether a Spot Light should simulate having a reflector.
            */
            public get enableSpotReflector(): boolean;
            public set enableSpotReflector(value: boolean);
            /** Set to true to override light bounding sphere for culling.
            */
            public get useBoundingSphereOverride(): boolean;
            public set useBoundingSphereOverride(value: boolean);
            /** Bounding sphere used to override the regular light bounding sphere during culling.
            */
            public get boundingSphereOverride(): UnityEngine.Vector4;
            public set boundingSphereOverride(value: UnityEngine.Vector4);
            /** Whether to cull shadows for this Light when the Light is outside of the view frustum.
            */
            public get useViewFrustumForShadowCasterCull(): boolean;
            public set useViewFrustumForShadowCasterCull(value: boolean);
            /** Force a light to be visible even if outside the view frustum.
            */
            public get forceVisible(): boolean;
            public set forceVisible(value: boolean);
            /** The custom resolution of the shadow map.
            */
            public get shadowCustomResolution(): number;
            public set shadowCustomResolution(value: number);
            /** Shadow mapping constant bias.
            */
            public get shadowBias(): number;
            public set shadowBias(value: number);
            /** Shadow mapping normal-based bias.
            */
            public get shadowNormalBias(): number;
            public set shadowNormalBias(value: number);
            /** Near plane value to use for shadow frustums.
            */
            public get shadowNearPlane(): number;
            public set shadowNearPlane(value: number);
            /** Set to true to enable custom matrix for culling during shadows.
            */
            public get useShadowMatrixOverride(): boolean;
            public set useShadowMatrixOverride(value: boolean);
            /** Matrix that overrides the regular light projection matrix during shadow culling. Unity uses this matrix if you set Light.useShadowMatrixOverride to true.
            */
            public get shadowMatrixOverride(): UnityEngine.Matrix4x4;
            public set shadowMatrixOverride(value: UnityEngine.Matrix4x4);
            /** 
            The range of each point of the light.
            Since area lights have a light emitting surface instead of a single point, the cumulative range of the light is larger than this property. This larger range can be read from the Light.dilatedRange property. For non-area lights, Light.range and Light.dilatedRange return the same value.
            */
            public get range(): number;
            public set range(value: number);
            /** 
            The Light.range property describes the range of each point on the light. However, area lights consist of several light-emitting points, and so the effective range is a bit larger, and depends on the size of the area light. This property returns this larger range. Use this property to find whether a given world-space point will be lit by the area light.
            If not an area light, then returns the same value as Light.range.
            */
            public get dilatedRange(): number;
            /** The to use for this light.
            */
            public get flare(): UnityEngine.Flare;
            public set flare(value: UnityEngine.Flare);
            /** This property describes the output of the last Global Illumination bake.
            */
            public get bakingOutput(): UnityEngine.LightBakingOutput;
            public set bakingOutput(value: UnityEngine.LightBakingOutput);
            /** This is used to light certain objects in the Scene selectively.
            */
            public get cullingMask(): number;
            public set cullingMask(value: number);
            /** Determines which rendering LayerMask this Light affects.
            */
            public get renderingLayerMask(): number;
            public set renderingLayerMask(value: number);
            /** Allows you to override the global Shadowmask Mode per light. Only use this with render pipelines that can handle per light Shadowmask modes. Incompatible with the legacy renderers.
            */
            public get lightShadowCasterMode(): UnityEngine.LightShadowCasterMode;
            public set lightShadowCasterMode(value: UnityEngine.LightShadowCasterMode);
            /** Controls the amount of artificial softening applied to the edges of shadows cast by the Point or Spot light (Editor only).
            */
            public get shadowRadius(): number;
            public set shadowRadius(value: number);
            /** Controls the amount of artificial softening applied to the edges of shadows cast by directional lights (Editor only).
            */
            public get shadowAngle(): number;
            public set shadowAngle(value: number);
            /** How this light casts shadows
            */
            public get shadows(): UnityEngine.LightShadows;
            public set shadows(value: UnityEngine.LightShadows);
            /** Strength of light's shadows.
            */
            public get shadowStrength(): number;
            public set shadowStrength(value: number);
            /** The resolution of the shadow map.
            */
            public get shadowResolution(): UnityEngine.Rendering.LightShadowResolution;
            public set shadowResolution(value: UnityEngine.Rendering.LightShadowResolution);
            /** Per-light, per-layer shadow culling distances. Directional lights only. 
            */
            public get layerShadowCullDistances(): System.Array$1<number>;
            public set layerShadowCullDistances(value: System.Array$1<number>);
            /** The size of a directional light's cookie.
            */
            public get cookieSize(): number;
            public set cookieSize(value: number);
            /** The cookie texture projected by the light.
            */
            public get cookie(): UnityEngine.Texture;
            public set cookie(value: UnityEngine.Texture);
            /** How to render the light.
            */
            public get renderMode(): UnityEngine.LightRenderMode;
            public set renderMode(value: UnityEngine.LightRenderMode);
            /** The size of the area light.
            */
            public get areaSize(): UnityEngine.Vector2;
            public set areaSize(value: UnityEngine.Vector2);
            /** This property describes what part of a light's contribution can be baked (Editor only).
            */
            public get lightmapBakeType(): UnityEngine.LightmapBakeType;
            public set lightmapBakeType(value: UnityEngine.LightmapBakeType);
            /** Number of command buffers set up on this light (Read Only).
            */
            public get commandBufferCount(): number;
            /** Revert all light parameters to default.
            */
            public Reset () : void
            /** Sets a light dirty to notify the light baking backends to update their internal light representation (Editor only).
            */
            public SetLightDirty () : void
            /** Add a command buffer to be executed at a specified place.
            * @param $evt When to execute the command buffer during rendering.
            * @param $buffer The buffer to execute.
            * @param $shadowPassMask A mask specifying which shadow passes to execute the buffer for.
            */
            public AddCommandBuffer ($evt: UnityEngine.Rendering.LightEvent, $buffer: UnityEngine.Rendering.CommandBuffer) : void
            /** Add a command buffer to be executed at a specified place.
            * @param $evt When to execute the command buffer during rendering.
            * @param $buffer The buffer to execute.
            * @param $shadowPassMask A mask specifying which shadow passes to execute the buffer for.
            */
            public AddCommandBuffer ($evt: UnityEngine.Rendering.LightEvent, $buffer: UnityEngine.Rendering.CommandBuffer, $shadowPassMask: UnityEngine.Rendering.ShadowMapPass) : void
            /** Adds a command buffer to the GPU's async compute queues and executes that command buffer when graphics processing reaches a given point.
            * @param $evt The point during the graphics processing at which this command buffer should commence on the GPU.
            * @param $buffer The buffer to execute.
            * @param $queueType The desired async compute queue type to execute the buffer on.
            * @param $shadowPassMask A mask specifying which shadow passes to execute the buffer for.
            */
            public AddCommandBufferAsync ($evt: UnityEngine.Rendering.LightEvent, $buffer: UnityEngine.Rendering.CommandBuffer, $queueType: UnityEngine.Rendering.ComputeQueueType) : void
            /** Adds a command buffer to the GPU's async compute queues and executes that command buffer when graphics processing reaches a given point.
            * @param $evt The point during the graphics processing at which this command buffer should commence on the GPU.
            * @param $buffer The buffer to execute.
            * @param $queueType The desired async compute queue type to execute the buffer on.
            * @param $shadowPassMask A mask specifying which shadow passes to execute the buffer for.
            */
            public AddCommandBufferAsync ($evt: UnityEngine.Rendering.LightEvent, $buffer: UnityEngine.Rendering.CommandBuffer, $shadowPassMask: UnityEngine.Rendering.ShadowMapPass, $queueType: UnityEngine.Rendering.ComputeQueueType) : void
            /** Remove command buffer from execution at a specified place.
            * @param $evt When to execute the command buffer during rendering.
            * @param $buffer The buffer to execute.
            */
            public RemoveCommandBuffer ($evt: UnityEngine.Rendering.LightEvent, $buffer: UnityEngine.Rendering.CommandBuffer) : void
            /** Remove command buffers from execution at a specified place.
            * @param $evt When to execute the command buffer during rendering.
            */
            public RemoveCommandBuffers ($evt: UnityEngine.Rendering.LightEvent) : void
            /** Remove all command buffers set on this light.
            */
            public RemoveAllCommandBuffers () : void
            /** Get command buffers to be executed at a specified place.
            * @param $evt When to execute the command buffer during rendering.
            * @returns Array of command buffers. 
            */
            public GetCommandBuffers ($evt: UnityEngine.Rendering.LightEvent) : System.Array$1<UnityEngine.Rendering.CommandBuffer>
            public constructor ()
        }
        /** The type of a Light.
        */
        enum LightType
        { Spot = 0, Directional = 1, Point = 2, Area = 3, Rectangle = 3, Disc = 4, Pyramid = 5, Box = 6, Tube = 7 }
        /** Describes the shape of a spot light.
        */
        enum LightShape
        { Cone = 0, Pyramid = 1, Box = 2 }
        /** A flare asset. Read more about flares in the.
        */
        class Flare extends UnityEngine.Object
        {
            protected [__keep_incompatibility]: never;
        }
        /** Struct describing the result of a Global Illumination bake for a given light.
        */
        class LightBakingOutput extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        /** Allows mixed lights to control shadow caster culling when Shadowmasks are present.
        */
        enum LightShadowCasterMode
        { Default = 0, NonLightmappedOnly = 1, Everything = 2 }
        /** Shadow casting options for a Light.
        */
        enum LightShadows
        { None = 0, Hard = 1, Soft = 2 }
        /** How the Light is rendered.
        */
        enum LightRenderMode
        { Auto = 0, ForcePixel = 1, ForceVertex = 2 }
        /** Enum describing what part of a light contribution can be baked.
        */
        enum LightmapBakeType
        { Realtime = 4, Baked = 2, Mixed = 1 }
        enum LightmappingMode
        { Realtime = 4, Baked = 2, Mixed = 1 }
        /** Anisotropic filtering mode.
        */
        enum AnisotropicFiltering
        { Disable = 0, Enable = 1, ForceEnable = 2 }
        /** Wrap mode for textures.
        */
        enum TextureWrapMode
        { Repeat = 0, Clamp = 1, Mirror = 2, MirrorOnce = 3 }
        /** Filtering mode for textures. Corresponds to the settings in a.
        */
        enum FilterMode
        { Point = 0, Bilinear = 1, Trilinear = 2 }
        /** Represents  a 128-bit hash value.
        */
        class Hash128 extends System.ValueType implements System.IComparable, System.IComparable$1<UnityEngine.Hash128>, System.IEquatable$1<UnityEngine.Hash128>
        {
            protected [__keep_incompatibility]: never;
        }
        /** Class that represents textures in C# code.
        */
        class Texture2D extends UnityEngine.Texture
        {
            protected [__keep_incompatibility]: never;
            /** The format of the pixel data in the texture (Read Only).
            */
            public get format(): UnityEngine.TextureFormat;
            /** The name of the texture mipmap limit group that this texture is associated with. (Read Only)
            */
            public get mipmapLimitGroup(): string;
            /** The number of high resolution mipmap levels from the texture that Unity doesn't upload to the GPU. (Read Only)
            */
            public get activeMipmapLimit(): number;
            /** Gets a small Texture with all white pixels.
            */
            public static get whiteTexture(): UnityEngine.Texture2D;
            /** Gets a small Texture with all black pixels.
            */
            public static get blackTexture(): UnityEngine.Texture2D;
            /** Gets a small Texture with all red pixels.
            */
            public static get redTexture(): UnityEngine.Texture2D;
            /** Gets a small Texture with all gray pixels.
            */
            public static get grayTexture(): UnityEngine.Texture2D;
            /** Gets a small Texture with all gray pixels.
            */
            public static get linearGrayTexture(): UnityEngine.Texture2D;
            /** Gets a small Texture with pixels that represent surface normal vectors at a neutral position.
            */
            public static get normalTexture(): UnityEngine.Texture2D;
            public get isReadable(): boolean;
            /** Returns true if the VTOnly checkbox was checked when the texture was imported; otherwise returns false. For additional information, see TextureImporter.vtOnly.
            */
            public get vtOnly(): boolean;
            /** Determines whether mipmap streaming is enabled for this Texture.
            */
            public get streamingMipmaps(): boolean;
            /** Sets the relative priority for this Texture when reducing memory size to fit within the memory budget.
            */
            public get streamingMipmapsPriority(): number;
            /** The mipmap level to load.
            */
            public get requestedMipmapLevel(): number;
            public set requestedMipmapLevel(value: number);
            /** Restricts the mipmap streaming system to a minimum mip level for this Texture.
            */
            public get minimumMipmapLevel(): number;
            public set minimumMipmapLevel(value: number);
            /** The mipmap level calculated by the streaming system, which takes into account the streaming Cameras and the location of the objects containing this Texture. This is unaffected by requestedMipmapLevel or minimumMipmapLevel.
            */
            public get calculatedMipmapLevel(): number;
            /** The mipmap level that the streaming system would load before memory budgets are applied.
            */
            public get desiredMipmapLevel(): number;
            /** The mipmap level that the mipmap streaming system is in the process of loading.
            */
            public get loadingMipmapLevel(): number;
            /** The mipmap level that is currently loaded by the streaming system.
            */
            public get loadedMipmapLevel(): number;
            /** Indicates whether this texture was imported with TextureImporter.alphaIsTransparency enabled. This setting is available only in the Editor scripts. Note that changing this setting will have no effect; it must be enabled in TextureImporter instead.
            */
            public get alphaIsTransparency(): boolean;
            public set alphaIsTransparency(value: boolean);
            /** This property causes a texture to ignore all texture mipmap limit settings.
            */
            public get ignoreMipmapLimit(): boolean;
            public set ignoreMipmapLimit(value: boolean);
            /** Compress texture at runtime to DXT/BCn or ETC formats.
            */
            public Compress ($highQuality: boolean) : void
            /** Resets the requestedMipmapLevel field.
            */
            public ClearRequestedMipmapLevel () : void
            /** Checks to see whether the mipmap level set by requestedMipmapLevel has finished loading.
            * @returns True if the mipmap level requested by requestedMipmapLevel has finished loading. 
            */
            public IsRequestedMipmapLevelLoaded () : boolean
            /** Resets the minimumMipmapLevel field.
            */
            public ClearMinimumMipmapLevel () : void
            /** Updates Unity texture to use different native texture object.
            * @param $nativeTex Native 2D texture object.
            */
            public UpdateExternalTexture ($nativeTex: System.IntPtr) : void
            /** Gets the raw data from a texture, as a copy.
            * @returns A byte array that contains raw texture data. 
            */
            public GetRawTextureData () : System.Array$1<number>
            /** Gets the pixel color data for part of a mipmap level as Color structs.
            * @param $x The starting x position of the section to fetch.
            * @param $y The starting y position of the section to fetch.
            * @param $blockWidth The width of the section to fetch.
            * @param $blockHeight The height of the section to fetch.
            * @param $miplevel The mipmap level to read from. The range is 0 through the texture's Texture.mipmapCount. The default value is 0.
            * @returns An array that contains the pixel colors. 
            */
            public GetPixels ($x: number, $y: number, $blockWidth: number, $blockHeight: number, $miplevel: number) : System.Array$1<UnityEngine.Color>
            /** Gets the pixel color data for part of a mipmap level as Color structs.
            * @param $x The starting x position of the section to fetch.
            * @param $y The starting y position of the section to fetch.
            * @param $blockWidth The width of the section to fetch.
            * @param $blockHeight The height of the section to fetch.
            * @param $miplevel The mipmap level to read from. The range is 0 through the texture's Texture.mipmapCount. The default value is 0.
            * @returns An array that contains the pixel colors. 
            */
            public GetPixels ($x: number, $y: number, $blockWidth: number, $blockHeight: number) : System.Array$1<UnityEngine.Color>
            /** Gets the pixel color data for a mipmap level as Color32 structs.
            * @param $miplevel The mipmap level to get. The range is 0 through the texture's Texture.mipmapCount. The default value is 0.
            * @returns An array that contains the pixel colors. 
            */
            public GetPixels32 ($miplevel: number) : System.Array$1<UnityEngine.Color32>
            public GetPixels32 () : System.Array$1<UnityEngine.Color32>
            /** Packs multiple Textures into a texture atlas.
            * @param $textures Array of textures to pack into the atlas.
            * @param $padding Padding in pixels between the packed textures.
            * @param $maximumAtlasSize Maximum size of the resulting texture.
            * @param $makeNoLongerReadable Should the texture be marked as no longer readable?
            * @returns An array of rectangles containing the UV coordinates in the atlas for each input texture, or null if packing fails. 
            */
            public PackTextures ($textures: System.Array$1<UnityEngine.Texture2D>, $padding: number, $maximumAtlasSize: number, $makeNoLongerReadable: boolean) : System.Array$1<UnityEngine.Rect>
            public PackTextures ($textures: System.Array$1<UnityEngine.Texture2D>, $padding: number, $maximumAtlasSize: number) : System.Array$1<UnityEngine.Rect>
            public PackTextures ($textures: System.Array$1<UnityEngine.Texture2D>, $padding: number) : System.Array$1<UnityEngine.Rect>
            /** Creates a Unity Texture out of an externally created native texture object.
            * @param $nativeTex Native 2D texture object.
            * @param $width Width of texture in pixels.
            * @param $height Height of texture in pixels.
            * @param $format Format of underlying texture object.
            * @param $mipmap Does the texture have mipmaps?
            * @param $linear Is texture using linear color space?
            */
            public static CreateExternalTexture ($width: number, $height: number, $format: UnityEngine.TextureFormat, $mipChain: boolean, $linear: boolean, $nativeTex: System.IntPtr) : UnityEngine.Texture2D
            /** Sets the pixel color at coordinates (x,y).
            * @param $x The x coordinate of the pixel to set. The range is 0 through (texture width - 1).
            * @param $y The y coordinate of the pixel to set. The range is 0 through (texture height - 1).
            * @param $color The color to set.
            * @param $mipLevel The mipmap level to write to. The range is 0 through the texture's Texture.mipmapCount. The default value is 0.
            */
            public SetPixel ($x: number, $y: number, $color: UnityEngine.Color) : void
            /** Sets the pixel color at coordinates (x,y).
            * @param $x The x coordinate of the pixel to set. The range is 0 through (texture width - 1).
            * @param $y The y coordinate of the pixel to set. The range is 0 through (texture height - 1).
            * @param $color The color to set.
            * @param $mipLevel The mipmap level to write to. The range is 0 through the texture's Texture.mipmapCount. The default value is 0.
            */
            public SetPixel ($x: number, $y: number, $color: UnityEngine.Color, $mipLevel: number) : void
            /** Sets the pixel colors of part of a mipmap level.
            * @param $x The x coordinate to place the block of pixels at. The range is 0 through (texture width - 1).
            * @param $y The y coordinate to place the block of pixels at. The range is 0 through (texture height - 1).
            * @param $blockWidth The width of the block of pixels to set.
            * @param $blockHeight The height of the block of pixels to set.
            * @param $colors The array of pixel colours to use. This is a 2D image flattened to a 1D array. Must be blockWidth x blockHeight in length.
            * @param $miplevel The mipmap level to write colors to. The range is 0 through the texture's Texture.mipmapCount. The default value is 0.
            */
            public SetPixels ($x: number, $y: number, $blockWidth: number, $blockHeight: number, $colors: System.Array$1<UnityEngine.Color>, $miplevel: number) : void
            public SetPixels ($x: number, $y: number, $blockWidth: number, $blockHeight: number, $colors: System.Array$1<UnityEngine.Color>) : void
            /** Sets the pixel colors of an entire mipmap level.
            * @param $colors The array of pixel colours to use. This is a 2D image flattened to a 1D array.
            * @param $miplevel The mipmap level to write colors to. The range is 0 through the texture's Texture.mipmapCount. The default value is 0.
            */
            public SetPixels ($colors: System.Array$1<UnityEngine.Color>, $miplevel: number) : void
            public SetPixels ($colors: System.Array$1<UnityEngine.Color>) : void
            /** Gets the pixel color at coordinates (x, y).
            * @param $x The x coordinate of the pixel to get. The range is 0 through (texture width - 1).
            * @param $y The y coordinate of the pixel to get. The range is 0 through (texture height - 1).
            * @param $mipLevel The mipmap level to sample. The range is 0 through the texture's Texture.mipmapCount. The default value is 0.
            * @returns The pixel color. 
            */
            public GetPixel ($x: number, $y: number) : UnityEngine.Color
            /** Gets the pixel color at coordinates (x, y).
            * @param $x The x coordinate of the pixel to get. The range is 0 through (texture width - 1).
            * @param $y The y coordinate of the pixel to get. The range is 0 through (texture height - 1).
            * @param $mipLevel The mipmap level to sample. The range is 0 through the texture's Texture.mipmapCount. The default value is 0.
            * @returns The pixel color. 
            */
            public GetPixel ($x: number, $y: number, $mipLevel: number) : UnityEngine.Color
            /** Gets the filtered pixel color at the normalized coordinates (u, v).
            * @param $u The u coordinate of the pixel to get.
            * @param $v The v coordinate of the pixel to get.
            * @param $mipLevel The mipmap level to read from. The range is 0 through the texture's Texture.mipmapCount. The default value is 0.
            * @returns The pixel color. 
            */
            public GetPixelBilinear ($u: number, $v: number) : UnityEngine.Color
            /** Gets the filtered pixel color at the normalized coordinates (u, v).
            * @param $u The u coordinate of the pixel to get.
            * @param $v The v coordinate of the pixel to get.
            * @param $mipLevel The mipmap level to read from. The range is 0 through the texture's Texture.mipmapCount. The default value is 0.
            * @returns The pixel color. 
            */
            public GetPixelBilinear ($u: number, $v: number, $mipLevel: number) : UnityEngine.Color
            /** Sets the raw data of an entire texture in CPU memory.
            * @param $data The array of data to use.
            * @param $size The size of the data in bytes.
            */
            public LoadRawTextureData ($data: System.IntPtr, $size: number) : void
            /** Sets the raw data of an entire texture in CPU memory.
            * @param $data The array of data to use.
            * @param $size The size of the data in bytes.
            */
            public LoadRawTextureData ($data: System.Array$1<number>) : void
            /** Copies changes you've made in a CPU texture to the GPU.
            * @param $updateMipmaps When the value is true, Unity recalculates mipmap levels, using mipmap level 0 as the source. The default value is true.
            * @param $makeNoLongerReadable When the value is true, Unity deletes the texture in CPU memory after it uploads it to the GPU, and sets Texture.isReadable|isReadable to false. The default value is false.
            */
            public Apply ($updateMipmaps: boolean, $makeNoLongerReadable: boolean) : void
            public Apply ($updateMipmaps: boolean) : void
            public Apply () : void
            /** Reinitializes a Texture2D, making it possible for you to replace width, height, textureformat, and graphicsformat data for that texture.
            * @param $width The new width of the texture.
            * @param $height The new height of the texture.
            * @param $format The new format of the texture.
            * @param $hasMipMap Whether the texture reserves memory for a full mipmap chain.
            * @returns true if the reinitialization was a success. 
            */
            public Reinitialize ($width: number, $height: number) : boolean
            /** Reinitializes a Texture2D, making it possible for you to replace width, height, textureformat, and graphicsformat data for that texture.
            * @param $width The new width of the texture.
            * @param $height The new height of the texture.
            * @param $format The new format of the texture.
            * @param $hasMipMap Whether the texture reserves memory for a full mipmap chain.
            * @returns true if the reinitialization was a success. 
            */
            public Reinitialize ($width: number, $height: number, $format: UnityEngine.TextureFormat, $hasMipMap: boolean) : boolean
            /** Reinitializes a Texture2D, making it possible for you to replace width, height, textureformat, and graphicsformat data for that texture.
            * @param $width The new width of the texture.
            * @param $height The new height of the texture.
            * @param $format The new format of the texture.
            * @param $hasMipMap Whether the texture reserves memory for a full mipmap chain.
            * @returns true if the reinitialization was a success. 
            */
            public Reinitialize ($width: number, $height: number, $format: UnityEngine.Experimental.Rendering.GraphicsFormat, $hasMipMap: boolean) : boolean
            /** Reads pixels from the current render target and writes them to a texture.
            * @param $source The region of the render target to read from.
            * @param $destX The x position in the texture to write the pixels to.
            * @param $destY The y position in the texture to write the pixels to.
            * @param $recalculateMipMaps When the value is true, Unity automatically recalculates the mipmap for the texture after it writes the pixel data. Otherwise, Unity doesn't do this automatically.
            */
            public ReadPixels ($source: UnityEngine.Rect, $destX: number, $destY: number, $recalculateMipMaps: boolean) : void
            public ReadPixels ($source: UnityEngine.Rect, $destX: number, $destY: number) : void
            public static GenerateAtlas ($sizes: System.Array$1<UnityEngine.Vector2>, $padding: number, $atlasSize: number, $results: System.Collections.Generic.List$1<UnityEngine.Rect>) : boolean
            /** Sets the pixel colors of an entire mipmap level.
            * @param $colors The array of pixel colours to use. This is a 2D image flattened to a 1D array.
            * @param $miplevel The mipmap level to write colors to. The range is 0 through the texture's Texture.mipmapCount. The default value is 0.
            */
            public SetPixels32 ($colors: System.Array$1<UnityEngine.Color32>, $miplevel: number) : void
            /** Sets the pixel colors of an entire mipmap level.
            * @param $colors The array of pixel colours to use. This is a 2D image flattened to a 1D array.
            * @param $miplevel The mipmap level to write colors to. The range is 0 through the texture's Texture.mipmapCount. The default value is 0.
            */
            public SetPixels32 ($colors: System.Array$1<UnityEngine.Color32>) : void
            /** Sets the pixel colors of part of a mipmap level.
            * @param $x The x coordinate to place the block of pixels at. The range is 0 through (texture width - 1).
            * @param $y The y coordinate to place the block of pixels at. The range is 0 through (texture height - 1).
            * @param $blockWidth The width of the block of pixels to set.
            * @param $blockHeight The height of the block of pixels to set.
            * @param $colors The array of pixel colours to use. This is a 2D image flattened to a 1D array. Must be blockWidth x blockHeight in length.
            * @param $miplevel The mipmap level to write colors to. The range is 0 through the texture's Texture.mipmapCount. The default value is 0.
            */
            public SetPixels32 ($x: number, $y: number, $blockWidth: number, $blockHeight: number, $colors: System.Array$1<UnityEngine.Color32>, $miplevel: number) : void
            /** Sets the pixel colors of part of a mipmap level.
            * @param $x The x coordinate to place the block of pixels at. The range is 0 through (texture width - 1).
            * @param $y The y coordinate to place the block of pixels at. The range is 0 through (texture height - 1).
            * @param $blockWidth The width of the block of pixels to set.
            * @param $blockHeight The height of the block of pixels to set.
            * @param $colors The array of pixel colours to use. This is a 2D image flattened to a 1D array. Must be blockWidth x blockHeight in length.
            * @param $miplevel The mipmap level to write colors to. The range is 0 through the texture's Texture.mipmapCount. The default value is 0.
            */
            public SetPixels32 ($x: number, $y: number, $blockWidth: number, $blockHeight: number, $colors: System.Array$1<UnityEngine.Color32>) : void
            /** Gets the pixel color data for a mipmap level as Color structs.
            * @param $miplevel The mipmap level to get. The range is 0 through the texture's Texture.mipmapCount. The default value is 0.
            * @returns An array that contains the pixel colors. 
            */
            public GetPixels ($miplevel: number) : System.Array$1<UnityEngine.Color>
            public GetPixels () : System.Array$1<UnityEngine.Color>
            /** Copies pixel data from another texture on the CPU.
            * @param $src The source texture.
            * @param $srcElement The element in the source texture to copy from. For example, the CubemapFace in a Cubemap or the slice in a texture array. Set the value to 0 if src is a 2D texture.
            * @param $srcMip The mipmap level to copy from. The range is 0 through the source texture's Texture.mipmapCount. The default value is 0.
            * @param $dstMip The mipmap level to write to. The range is 0 through this texture's Texture.mipmapCount. The default value is 0.
            * @param $srcX The starting x coordinate of src to copy from. 0 is the left of the texture.
            * @param $srcY The starting y coordinate of src to copy from. 0 is the bottom of the texture.
            * @param $srcWidth The width of src to copy.
            * @param $srcHeight The height of src to copy.
            * @param $dstX The x coordinate of this texture to copy to.
            * @param $dstY The y coordinate to this texture to copy to.
            */
            public CopyPixels ($src: UnityEngine.Texture) : void
            /** Copies pixel data from another texture on the CPU.
            * @param $src The source texture.
            * @param $srcElement The element in the source texture to copy from. For example, the CubemapFace in a Cubemap or the slice in a texture array. Set the value to 0 if src is a 2D texture.
            * @param $srcMip The mipmap level to copy from. The range is 0 through the source texture's Texture.mipmapCount. The default value is 0.
            * @param $dstMip The mipmap level to write to. The range is 0 through this texture's Texture.mipmapCount. The default value is 0.
            * @param $srcX The starting x coordinate of src to copy from. 0 is the left of the texture.
            * @param $srcY The starting y coordinate of src to copy from. 0 is the bottom of the texture.
            * @param $srcWidth The width of src to copy.
            * @param $srcHeight The height of src to copy.
            * @param $dstX The x coordinate of this texture to copy to.
            * @param $dstY The y coordinate to this texture to copy to.
            */
            public CopyPixels ($src: UnityEngine.Texture, $srcElement: number, $srcMip: number, $dstMip: number) : void
            /** Copies pixel data from another texture on the CPU.
            * @param $src The source texture.
            * @param $srcElement The element in the source texture to copy from. For example, the CubemapFace in a Cubemap or the slice in a texture array. Set the value to 0 if src is a 2D texture.
            * @param $srcMip The mipmap level to copy from. The range is 0 through the source texture's Texture.mipmapCount. The default value is 0.
            * @param $dstMip The mipmap level to write to. The range is 0 through this texture's Texture.mipmapCount. The default value is 0.
            * @param $srcX The starting x coordinate of src to copy from. 0 is the left of the texture.
            * @param $srcY The starting y coordinate of src to copy from. 0 is the bottom of the texture.
            * @param $srcWidth The width of src to copy.
            * @param $srcHeight The height of src to copy.
            * @param $dstX The x coordinate of this texture to copy to.
            * @param $dstY The y coordinate to this texture to copy to.
            */
            public CopyPixels ($src: UnityEngine.Texture, $srcElement: number, $srcMip: number, $srcX: number, $srcY: number, $srcWidth: number, $srcHeight: number, $dstMip: number, $dstX: number, $dstY: number) : void
            public constructor ($width: number, $height: number, $format: UnityEngine.Experimental.Rendering.DefaultFormat, $flags: UnityEngine.Experimental.Rendering.TextureCreationFlags)
            public constructor ($width: number, $height: number, $format: UnityEngine.Experimental.Rendering.DefaultFormat, $mipCount: number, $flags: UnityEngine.Experimental.Rendering.TextureCreationFlags)
            public constructor ($width: number, $height: number, $format: UnityEngine.Experimental.Rendering.DefaultFormat, $mipCount: number, $flags: UnityEngine.Experimental.Rendering.TextureCreationFlags, $mipmapLimitDescriptor: UnityEngine.MipmapLimitDescriptor)
            public constructor ($width: number, $height: number, $format: UnityEngine.Experimental.Rendering.GraphicsFormat, $flags: UnityEngine.Experimental.Rendering.TextureCreationFlags)
            public constructor ($width: number, $height: number, $format: UnityEngine.Experimental.Rendering.GraphicsFormat, $mipCount: number, $flags: UnityEngine.Experimental.Rendering.TextureCreationFlags)
            public constructor ($width: number, $height: number, $format: UnityEngine.Experimental.Rendering.GraphicsFormat, $mipCount: number, $flags: UnityEngine.Experimental.Rendering.TextureCreationFlags, $mipmapLimitDescriptor: UnityEngine.MipmapLimitDescriptor)
            public constructor ($width: number, $height: number, $textureFormat: UnityEngine.TextureFormat, $mipCount: number, $linear: boolean)
            public constructor ($width: number, $height: number, $textureFormat: UnityEngine.TextureFormat, $mipCount: number, $linear: boolean, $createUninitialized: boolean)
            public constructor ($width: number, $height: number, $textureFormat: UnityEngine.TextureFormat, $mipCount: number, $linear: boolean, $createUninitialized: boolean, $mipmapLimitDescriptor: UnityEngine.MipmapLimitDescriptor)
            public constructor ($width: number, $height: number, $textureFormat: UnityEngine.TextureFormat, $mipChain: boolean, $linear: boolean)
            public constructor ($width: number, $height: number, $textureFormat: UnityEngine.TextureFormat, $mipChain: boolean, $linear: boolean, $createUninitialized: boolean)
            public constructor ($width: number, $height: number, $textureFormat: UnityEngine.TextureFormat, $mipChain: boolean)
            public constructor ($width: number, $height: number)
            public constructor ()
        }
        /** Format used when creating textures from scripts.
        */
        enum TextureFormat
        { Alpha8 = 1, ARGB4444 = 2, RGB24 = 3, RGBA32 = 4, ARGB32 = 5, RGB565 = 7, R16 = 9, DXT1 = 10, DXT5 = 12, RGBA4444 = 13, BGRA32 = 14, RHalf = 15, RGHalf = 16, RGBAHalf = 17, RFloat = 18, RGFloat = 19, RGBAFloat = 20, YUY2 = 21, RGB9e5Float = 22, BC4 = 26, BC5 = 27, BC6H = 24, BC7 = 25, DXT1Crunched = 28, DXT5Crunched = 29, PVRTC_RGB2 = 30, PVRTC_RGBA2 = 31, PVRTC_RGB4 = 32, PVRTC_RGBA4 = 33, ETC_RGB4 = 34, EAC_R = 41, EAC_R_SIGNED = 42, EAC_RG = 43, EAC_RG_SIGNED = 44, ETC2_RGB = 45, ETC2_RGBA1 = 46, ETC2_RGBA8 = 47, ASTC_4x4 = 48, ASTC_5x5 = 49, ASTC_6x6 = 50, ASTC_8x8 = 51, ASTC_10x10 = 52, ASTC_12x12 = 53, ETC_RGB4_3DS = -60, ETC_RGBA8_3DS = -61, RG16 = 62, R8 = 63, ETC_RGB4Crunched = 64, ETC2_RGBA8Crunched = 65, ASTC_HDR_4x4 = 66, ASTC_HDR_5x5 = 67, ASTC_HDR_6x6 = 68, ASTC_HDR_8x8 = 69, ASTC_HDR_10x10 = 70, ASTC_HDR_12x12 = 71, RG32 = 72, RGB48 = 73, RGBA64 = 74, R8_SIGNED = 75, RG16_SIGNED = 76, RGB24_SIGNED = 77, RGBA32_SIGNED = 78, R16_SIGNED = 79, RG32_SIGNED = 80, RGB48_SIGNED = 81, RGBA64_SIGNED = 82, ASTC_RGB_4x4 = -48, ASTC_RGB_5x5 = -49, ASTC_RGB_6x6 = -50, ASTC_RGB_8x8 = -51, ASTC_RGB_10x10 = -52, ASTC_RGB_12x12 = -53, ASTC_RGBA_4x4 = -54, ASTC_RGBA_5x5 = -55, ASTC_RGBA_6x6 = -56, ASTC_RGBA_8x8 = -57, ASTC_RGBA_10x10 = -58, ASTC_RGBA_12x12 = -59 }
        /** Determines whether a texture uses a mipmap limit, and which mipmap limit the texture uses, when you create the texture using a constructor.
        */
        class MipmapLimitDescriptor extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        enum TexGenMode
        { None = 0, SphereMap = 1, Object = 2, EyeLinear = 3, CubeReflect = 4, CubeNormal = 5 }
        /** Script interface for the Built-in Particle System. Unity's powerful and versatile particle system implementation.
        */
        class ParticleSystem extends UnityEngine.Component
        {
            protected [__keep_incompatibility]: never;
            /** Determines whether the Particle System is playing.
            */
            public get isPlaying(): boolean;
            /** Determines whether the Particle System is emitting particles. A Particle System may stop emitting when its emission module has finished, it has been paused or if the system has been stopped using ParticleSystem.Stop|Stop with the ParticleSystemStopBehavior.StopEmitting|StopEmitting flag. Resume emitting by calling ParticleSystem.Play|Play.
            */
            public get isEmitting(): boolean;
            /** Determines whether the Particle System is in the stopped state.
            */
            public get isStopped(): boolean;
            /** Determines whether the Particle System is paused.
            */
            public get isPaused(): boolean;
            /** The current number of particles (Read Only). The number doesn't include particles of child Particle Systems
            */
            public get particleCount(): number;
            /** Playback position in seconds.
            */
            public get time(): number;
            public set time(value: number);
            /** Total playback time in seconds, including the Start Delay setting.
            */
            public get totalTime(): number;
            /** Override the random seed used for the Particle System emission.
            */
            public get randomSeed(): number;
            public set randomSeed(value: number);
            /** Controls whether the Particle System uses an automatically-generated random number to seed the random number generator.
            */
            public get useAutoRandomSeed(): boolean;
            public set useAutoRandomSeed(value: boolean);
            /** Determines whether this system supports Procedural Simulation.
            */
            public get proceduralSimulationSupported(): boolean;
            /** Determines whether the Particle System rotates its particles around only the Z axis, or whether the system specifies separate values for the X, Y and Z axes.
            */
            public get has3DParticleRotations(): boolean;
            /** Determines whether the Particle System uses a single value for the width and height (and depth, when using meshes), or if the system specifies different values for each axis.
            */
            public get hasNonUniformParticleSizes(): boolean;
            /** Access the main Particle System settings.
            */
            public get main(): UnityEngine.ParticleSystem.MainModule;
            /** Script interface for the EmissionModule of a Particle System.
            */
            public get emission(): UnityEngine.ParticleSystem.EmissionModule;
            /** Script interface for the ShapeModule of a Particle System. 
            */
            public get shape(): UnityEngine.ParticleSystem.ShapeModule;
            /** Script interface for the VelocityOverLifetimeModule of a Particle System.
            */
            public get velocityOverLifetime(): UnityEngine.ParticleSystem.VelocityOverLifetimeModule;
            /** Script interface for the LimitVelocityOverLifetimeModule of a Particle System. .
            */
            public get limitVelocityOverLifetime(): UnityEngine.ParticleSystem.LimitVelocityOverLifetimeModule;
            /** Script interface for the InheritVelocityModule of a Particle System.
            */
            public get inheritVelocity(): UnityEngine.ParticleSystem.InheritVelocityModule;
            /** Script interface for the Particle System Lifetime By Emitter Speed module.
            */
            public get lifetimeByEmitterSpeed(): UnityEngine.ParticleSystem.LifetimeByEmitterSpeedModule;
            /** Script interface for the ForceOverLifetimeModule of a Particle System.
            */
            public get forceOverLifetime(): UnityEngine.ParticleSystem.ForceOverLifetimeModule;
            /** Script interface for the ColorOverLifetimeModule of a Particle System.
            */
            public get colorOverLifetime(): UnityEngine.ParticleSystem.ColorOverLifetimeModule;
            /** Script interface for the ColorByLifetimeModule of a Particle System.
            */
            public get colorBySpeed(): UnityEngine.ParticleSystem.ColorBySpeedModule;
            /** Script interface for the SizeOverLifetimeModule of a Particle System. 
            */
            public get sizeOverLifetime(): UnityEngine.ParticleSystem.SizeOverLifetimeModule;
            /** Script interface for the SizeBySpeedModule of a Particle System.
            */
            public get sizeBySpeed(): UnityEngine.ParticleSystem.SizeBySpeedModule;
            /** Script interface for the RotationOverLifetimeModule of a Particle System.
            */
            public get rotationOverLifetime(): UnityEngine.ParticleSystem.RotationOverLifetimeModule;
            /** Script interface for the RotationBySpeedModule of a Particle System.
            */
            public get rotationBySpeed(): UnityEngine.ParticleSystem.RotationBySpeedModule;
            /** Script interface for the ExternalForcesModule of a Particle System.
            */
            public get externalForces(): UnityEngine.ParticleSystem.ExternalForcesModule;
            /** Script interface for the NoiseModule of a Particle System.
            */
            public get noise(): UnityEngine.ParticleSystem.NoiseModule;
            /** Script interface for the CollisionModule of a Particle System.
            */
            public get collision(): UnityEngine.ParticleSystem.CollisionModule;
            /** Script interface for the TriggerModule of a Particle System.
            */
            public get trigger(): UnityEngine.ParticleSystem.TriggerModule;
            /** Script interface for the SubEmittersModule of a Particle System.
            */
            public get subEmitters(): UnityEngine.ParticleSystem.SubEmittersModule;
            /** Script interface for the TextureSheetAnimationModule of a Particle System.
            */
            public get textureSheetAnimation(): UnityEngine.ParticleSystem.TextureSheetAnimationModule;
            /** Script interface for the LightsModule of a Particle System.
            */
            public get lights(): UnityEngine.ParticleSystem.LightsModule;
            /** Script interface for the TrailsModule of a Particle System.
            */
            public get trails(): UnityEngine.ParticleSystem.TrailModule;
            /** Script interface for the CustomDataModule of a Particle System.
            */
            public get customData(): UnityEngine.ParticleSystem.CustomDataModule;
            public SetParticles ($particles: System.Array$1<UnityEngine.ParticleSystem.Particle>, $size: number, $offset: number) : void
            public SetParticles ($particles: System.Array$1<UnityEngine.ParticleSystem.Particle>, $size: number) : void
            public SetParticles ($particles: System.Array$1<UnityEngine.ParticleSystem.Particle>) : void
            public SetParticles ($particles: Unity.Collections.NativeArray$1<UnityEngine.ParticleSystem.Particle>, $size: number, $offset: number) : void
            public SetParticles ($particles: Unity.Collections.NativeArray$1<UnityEngine.ParticleSystem.Particle>, $size: number) : void
            public SetParticles ($particles: Unity.Collections.NativeArray$1<UnityEngine.ParticleSystem.Particle>) : void
            public GetParticles ($particles: System.Array$1<UnityEngine.ParticleSystem.Particle>, $size: number, $offset: number) : number
            public GetParticles ($particles: System.Array$1<UnityEngine.ParticleSystem.Particle>, $size: number) : number
            public GetParticles ($particles: System.Array$1<UnityEngine.ParticleSystem.Particle>) : number
            public GetParticles ($particles: Unity.Collections.NativeArray$1<UnityEngine.ParticleSystem.Particle>, $size: number, $offset: number) : number
            public GetParticles ($particles: Unity.Collections.NativeArray$1<UnityEngine.ParticleSystem.Particle>, $size: number) : number
            public GetParticles ($particles: Unity.Collections.NativeArray$1<UnityEngine.ParticleSystem.Particle>) : number
            public SetCustomParticleData ($customData: System.Collections.Generic.List$1<UnityEngine.Vector4>, $streamIndex: UnityEngine.ParticleSystemCustomData) : void
            public GetCustomParticleData ($customData: System.Collections.Generic.List$1<UnityEngine.Vector4>, $streamIndex: UnityEngine.ParticleSystemCustomData) : number
            /** Returns all the data that relates to the current internal state of the Particle System.
            * @returns The current internal state of the Particle System. 
            */
            public GetPlaybackState () : UnityEngine.ParticleSystem.PlaybackState
            public SetPlaybackState ($playbackState: UnityEngine.ParticleSystem.PlaybackState) : void
            /** Returns all the data relating to the current internal state of the Particle System Trails.
            * @returns The variable to populate with the Trails that currently belong to the Particle System.. 
            */
            public GetTrails () : UnityEngine.ParticleSystem.Trails
            public GetTrails ($trailData: $Ref<UnityEngine.ParticleSystem.Trails>) : number
            public SetTrails ($trailData: UnityEngine.ParticleSystem.Trails) : void
            /** Fast-forwards the Particle System by simulating particles over the given period of time, then pauses it.
            * @param $t Time period in seconds to advance the ParticleSystem simulation by. If restart is true, the ParticleSystem will be reset to 0 time, and then advanced by this value. If restart is false, the ParticleSystem simulation will be advanced in time from its current state by this value.
            * @param $withChildren Fast-forward all child Particle Systems as well.
            * @param $restart Restart and start from the beginning.
            * @param $fixedTimeStep Only update the system at fixed intervals, based on the value in "Fixed Time" in the Time options.
            */
            public Simulate ($t: number, $withChildren: boolean, $restart: boolean, $fixedTimeStep: boolean) : void
            /** Fast-forwards the Particle System by simulating particles over the given period of time, then pauses it.
            * @param $t Time period in seconds to advance the ParticleSystem simulation by. If restart is true, the ParticleSystem will be reset to 0 time, and then advanced by this value. If restart is false, the ParticleSystem simulation will be advanced in time from its current state by this value.
            * @param $withChildren Fast-forward all child Particle Systems as well.
            * @param $restart Restart and start from the beginning.
            * @param $fixedTimeStep Only update the system at fixed intervals, based on the value in "Fixed Time" in the Time options.
            */
            public Simulate ($t: number, $withChildren: boolean, $restart: boolean) : void
            /** Fast-forwards the Particle System by simulating particles over the given period of time, then pauses it.
            * @param $t Time period in seconds to advance the ParticleSystem simulation by. If restart is true, the ParticleSystem will be reset to 0 time, and then advanced by this value. If restart is false, the ParticleSystem simulation will be advanced in time from its current state by this value.
            * @param $withChildren Fast-forward all child Particle Systems as well.
            * @param $restart Restart and start from the beginning.
            * @param $fixedTimeStep Only update the system at fixed intervals, based on the value in "Fixed Time" in the Time options.
            */
            public Simulate ($t: number, $withChildren: boolean) : void
            /** Fast-forwards the Particle System by simulating particles over the given period of time, then pauses it.
            * @param $t Time period in seconds to advance the ParticleSystem simulation by. If restart is true, the ParticleSystem will be reset to 0 time, and then advanced by this value. If restart is false, the ParticleSystem simulation will be advanced in time from its current state by this value.
            * @param $withChildren Fast-forward all child Particle Systems as well.
            * @param $restart Restart and start from the beginning.
            * @param $fixedTimeStep Only update the system at fixed intervals, based on the value in "Fixed Time" in the Time options.
            */
            public Simulate ($t: number) : void
            /** Starts the Particle System.
            * @param $withChildren Play all child Particle Systems as well.
            */
            public Play ($withChildren: boolean) : void
            /** Starts the Particle System.
            * @param $withChildren Play all child Particle Systems as well.
            */
            public Play () : void
            /** Pauses the system so no new particles are emitted and the existing particles are not updated.
            * @param $withChildren Pause all child Particle Systems as well.
            */
            public Pause ($withChildren: boolean) : void
            /** Pauses the system so no new particles are emitted and the existing particles are not updated.
            * @param $withChildren Pause all child Particle Systems as well.
            */
            public Pause () : void
            /** Stops playing the Particle System using the supplied stop behaviour.
            * @param $withChildren Stop all child Particle Systems as well.
            * @param $stopBehavior Stop emitting or stop emitting and clear the system.
            */
            public Stop ($withChildren: boolean, $stopBehavior: UnityEngine.ParticleSystemStopBehavior) : void
            /** Stops playing the Particle System using the supplied stop behaviour.
            * @param $withChildren Stop all child Particle Systems as well.
            * @param $stopBehavior Stop emitting or stop emitting and clear the system.
            */
            public Stop ($withChildren: boolean) : void
            /** Stops playing the Particle System using the supplied stop behaviour.
            * @param $withChildren Stop all child Particle Systems as well.
            * @param $stopBehavior Stop emitting or stop emitting and clear the system.
            */
            public Stop () : void
            /** Remove all particles in the Particle System.
            * @param $withChildren Clear all child Particle Systems as well.
            */
            public Clear ($withChildren: boolean) : void
            /** Remove all particles in the Particle System.
            * @param $withChildren Clear all child Particle Systems as well.
            */
            public Clear () : void
            /** Does the Particle System contain any live particles, or will it produce more?
            * @param $withChildren Check all child Particle Systems as well.
            * @returns True if the Particle System contains live particles or is still creating new particles. False if the Particle System has stopped emitting particles and all particles are dead. 
            */
            public IsAlive ($withChildren: boolean) : boolean
            /** Does the Particle System contain any live particles, or will it produce more?
            * @param $withChildren Check all child Particle Systems as well.
            * @returns True if the Particle System contains live particles or is still creating new particles. False if the Particle System has stopped emitting particles and all particles are dead. 
            */
            public IsAlive () : boolean
            /** Emit count particles immediately.
            * @param $count Number of particles to emit.
            */
            public Emit ($count: number) : void
            public Emit ($emitParams: UnityEngine.ParticleSystem.EmitParams, $count: number) : void
            /** Triggers the specified sub emitter on all particles of the Particle System.
            * @param $subEmitterIndex Index of the sub emitter to trigger.
            */
            public TriggerSubEmitter ($subEmitterIndex: number) : void
            public TriggerSubEmitter ($subEmitterIndex: number, $particle: $Ref<UnityEngine.ParticleSystem.Particle>) : void
            public TriggerSubEmitter ($subEmitterIndex: number, $particles: System.Collections.Generic.List$1<UnityEngine.ParticleSystem.Particle>) : void
            /** Reset the cache of reserved graphics memory used for efficient rendering of Particle Systems.
            */
            public static ResetPreMappedBufferMemory () : void
            /** Limits the amount of graphics memory Unity reserves for efficient rendering of Particle Systems.
            * @param $vertexBuffersCount The maximum number of cached vertex buffers.
            * @param $indexBuffersCount The maximum number of cached index buffers.
            */
            public static SetMaximumPreMappedBufferCounts ($vertexBuffersCount: number, $indexBuffersCount: number) : void
            /** Ensures that the ParticleSystemJobs.ParticleSystemJobData._axisOfRotations|axisOfRotations particle attribute array is allocated.
            */
            public AllocateAxisOfRotationAttribute () : void
            /** Ensures that the ParticleSystemJobs.ParticleSystemJobData._meshIndices|meshIndices particle attribute array is allocated.
            */
            public AllocateMeshIndexAttribute () : void
            /** Ensures that the ParticleSystemJobs.ParticleSystemJobData.customData1|customData1 and ParticleSystemJobs.ParticleSystemJobData.customData1|customData2 particle attribute arrays are allocated.
            * @param $stream The custom data stream to allocate.
            */
            public AllocateCustomDataAttribute ($stream: UnityEngine.ParticleSystemCustomData) : void
            public constructor ()
        }
        /** The space to simulate particles in.
        */
        enum ParticleSystemSimulationSpace
        { Local = 0, World = 1, Custom = 2 }
        /** Control how particle systems apply transform scale.
        */
        enum ParticleSystemScalingMode
        { Hierarchy = 0, Local = 1, Shape = 2 }
        /** Which stream of custom particle data to set.
        */
        enum ParticleSystemCustomData
        { Custom1 = 0, Custom2 = 1 }
        /** The behavior to apply when calling ParticleSystem.Stop|Stop.
        */
        enum ParticleSystemStopBehavior
        { StopEmittingAndClear = 0, StopEmitting = 1 }
        /** The mode in which particles are emitted.
        */
        enum ParticleSystemEmissionType
        { Time = 0, Distance = 1 }
        /** Options for which physics system to use the gravity setting from.
        */
        enum ParticleSystemGravitySource
        { Physics3D = 0, Physics2D = 1 }
        /** Control how a Particle System calculates its velocity.
        */
        enum ParticleSystemEmitterVelocityMode
        { Transform = 0, Rigidbody = 1, Custom = 2 }
        /** The action to perform when the Particle System stops.
        */
        enum ParticleSystemStopAction
        { None = 0, Disable = 1, Destroy = 2, Callback = 3 }
        /** Control how particles are removed from the Particle System.
        */
        enum ParticleSystemRingBufferMode
        { Disabled = 0, PauseUntilReplaced = 1, LoopUntilReplaced = 2 }
        /** The action to perform when the Particle System is offscreen.
        */
        enum ParticleSystemCullingMode
        { Automatic = 0, PauseAndCatchup = 1, Pause = 2, AlwaysSimulate = 3 }
        /** The type of collisions to use for a given Particle System.
        */
        enum ParticleSystemCollisionType
        { Planes = 0, World = 1 }
        /** Whether to use 2D or 3D colliders for particle collisions.
        */
        enum ParticleSystemCollisionMode
        { Collision3D = 0, Collision2D = 1 }
        /** Quality of world collisions. Medium and low quality are approximate and may leak particles.
        */
        enum ParticleSystemCollisionQuality
        { High = 0, Medium = 1, Low = 2 }
        /** What action to perform when the particle trigger module passes a test.
        */
        enum ParticleSystemOverlapAction
        { Ignore = 0, Kill = 1, Callback = 2 }
        /** Whether collider information is available when using the ParticleSystem::GetTriggerParticles method.
        */
        enum ParticleSystemColliderQueryMode
        { Disabled = 0, One = 1, All = 2 }
        /** The emission shape.
        */
        enum ParticleSystemShapeType
        { Sphere = 0, SphereShell = 1, Hemisphere = 2, HemisphereShell = 3, Cone = 4, Box = 5, Mesh = 6, ConeShell = 7, ConeVolume = 8, ConeVolumeShell = 9, Circle = 10, CircleEdge = 11, SingleSidedEdge = 12, MeshRenderer = 13, SkinnedMeshRenderer = 14, BoxShell = 15, BoxEdge = 16, Donut = 17, Rectangle = 18, Sprite = 19, SpriteRenderer = 20 }
        /** The mode used to generate new points in a shape.
        */
        enum ParticleSystemShapeMultiModeValue
        { Random = 0, Loop = 1, PingPong = 2, BurstSpread = 3 }
        /** The mesh emission type.
        */
        enum ParticleSystemMeshShapeType
        { Vertex = 0, Edge = 1, Triangle = 2 }
        /** Represents a Sprite object for use in 2D gameplay.
        */
        class Sprite extends UnityEngine.Object
        {
            protected [__keep_incompatibility]: never;
        }
        /** Renders a Sprite for 2D graphics.
        */
        class SpriteRenderer extends UnityEngine.Renderer
        {
            protected [__keep_incompatibility]: never;
        }
        /** The texture channel.
        */
        enum ParticleSystemShapeTextureChannel
        { Red = 0, Green = 1, Blue = 2, Alpha = 3 }
        /** The animation mode.
        */
        enum ParticleSystemAnimationMode
        { Grid = 0, Sprites = 1 }
        /** Control how animation frames are selected.
        */
        enum ParticleSystemAnimationTimeMode
        { Lifetime = 0, Speed = 1, FPS = 2 }
        /** The animation type.
        */
        enum ParticleSystemAnimationType
        { WholeSheet = 0, SingleRow = 1 }
        /** The mode used for selecting rows of an animation in the Texture Sheet Animation Module.
        */
        enum ParticleSystemAnimationRowMode
        { Custom = 0, Random = 1, MeshIndex = 2 }
        /** The particle GameObject filtering mode that specifies which objects are used by specific Particle System modules.
        */
        enum ParticleSystemGameObjectFilter
        { LayerMask = 0, List = 1, LayerMaskAndList = 2 }
        /** Script interface for Particle System Force Fields.
        */
        class ParticleSystemForceField extends UnityEngine.Behaviour
        {
            protected [__keep_incompatibility]: never;
        }
        /** How to apply emitter velocity to particles.
        */
        enum ParticleSystemInheritVelocityMode
        { Initial = 0, Current = 1 }
        /** The quality of the generated noise.
        */
        enum ParticleSystemNoiseQuality
        { Low = 0, Medium = 1, High = 2 }
        /** The events that cause new particles to be spawned.
        */
        enum ParticleSystemSubEmitterType
        { Birth = 0, Collision = 1, Death = 2, Trigger = 3, Manual = 4 }
        /** The properties of sub-emitter particles.
        */
        enum ParticleSystemSubEmitterProperties
        { InheritNothing = 0, InheritEverything = 31, InheritColor = 1, InheritSize = 2, InheritRotation = 4, InheritLifetime = 8, InheritDuration = 16 }
        /** Choose how Particle Trails are generated.
        */
        enum ParticleSystemTrailMode
        { PerParticle = 0, Ribbon = 1 }
        /** Choose how textures are applied to Particle Trails.
        */
        enum ParticleSystemTrailTextureMode
        { Stretch = 0, Tile = 1, DistributePerSegment = 2, RepeatPerSegment = 3, Static = 4 }
        /** Position, size, anchor and pivot information for a rectangle.
        */
        class RectTransform extends UnityEngine.Transform implements System.Collections.IEnumerable
        {
            protected [__keep_incompatibility]: never;
        }
        /** Interface for on-screen keyboards. Only native iPhone, Android, and Windows Store Apps are supported.
        */
        class TouchScreenKeyboard extends System.Object
        {
            protected [__keep_incompatibility]: never;
        }
        /** Enumeration of the different types of supported touchscreen keyboards.
        */
        enum TouchScreenKeyboardType
        { Default = 0, ASCIICapable = 1, NumbersAndPunctuation = 2, URL = 3, NumberPad = 4, PhonePad = 5, NamePhonePad = 6, EmailAddress = 7, NintendoNetworkAccount = 8, Social = 9, Search = 10, DecimalPad = 11, OneTimeCode = 12 }
        /** A UnityGUI event.
        */
        class Event extends System.Object
        {
            protected [__keep_incompatibility]: never;
        }
        interface ICanvasRaycastFilter
        {
        }
        /** Spectrum analysis windowing types.
        */
        enum FFTWindow
        { Rectangular = 0, Triangle = 1, Hamming = 2, Hanning = 3, Blackman = 4, BlackmanHarris = 5 }
        /** Use ForceMode to specify how to apply a force using Rigidbody.AddForce or ArticulationBody.AddForce.
        */
        enum ForceMode
        { Force = 0, Acceleration = 5, Impulse = 1, VelocityChange = 2 }
        /** Cooking options that are available with MeshCollider.
        */
        enum MeshColliderCookingOptions
        { None = 0, InflateConvexMesh = 1, CookForFasterSimulation = 2, EnableMeshCleaning = 4, WeldColocatedVertices = 8, UseFastMidphase = 16 }
        /** Use these flags to constrain motion of Rigidbodies.
        */
        enum RigidbodyConstraints
        { None = 0, FreezePositionX = 2, FreezePositionY = 4, FreezePositionZ = 8, FreezeRotationX = 16, FreezeRotationY = 32, FreezeRotationZ = 64, FreezePosition = 14, FreezeRotation = 112, FreezeAll = 126 }
        /** Rigidbody interpolation mode.
        */
        enum RigidbodyInterpolation
        { None = 0, Interpolate = 1, Extrapolate = 2 }
        /** The collision detection mode constants used for Rigidbody.collisionDetectionMode.
        */
        enum CollisionDetectionMode
        { Discrete = 0, Continuous = 1, ContinuousDynamic = 2, ContinuousSpeculative = 3 }
        /** Determines how to snap physics joints back to its constrained position when it drifts off too much.
        */
        enum JointProjectionMode
        { None = 0, PositionAndRotation = 1, PositionOnly = 2 }
        /** Control ConfigurableJoint's rotation with either X & YZ or Slerp Drive.
        */
        enum RotationDriveMode
        { XYAndZ = 0, Slerp = 1 }
    }
    namespace VoxelPlayground.Engine {
        class SerializableMonoBehaviour extends UnityEngine.MonoBehaviour
        {
            protected [__keep_incompatibility]: never;
        }
        interface IVoxelDestructible
        {
        }
        class VoxelChunk extends UnityEngine.MonoBehaviour implements System.IEquatable$1<VoxelPlayground.Engine.VoxelChunk>
        {
            protected [__keep_incompatibility]: never;
        }
        class VoxelVolumeBase extends UnityEngine.MonoBehaviour
        {
            protected [__keep_incompatibility]: never;
        }
        class VoxelVolume extends VoxelPlayground.Engine.VoxelVolumeBase
        {
            protected [__keep_incompatibility]: never;
        }
        class PointDataV2 extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            public color : number
            public originalColor : number
            public properties : number
            public static ID_EMPTY : number
            public static ID_SKIN : number
            public static ID_STONE : number
            public static ID_METAL : number
            public static ID_GLOW : number
            public static ID_GLASS : number
            public static NORMAL_HARDNESS : number
            public static MAX_HARDNESS : number
            public static NORMAL_TOUGHNESS : number
            public static MAX_TOUGHNESS : number
            public static NORMAL_TEMPERATURE : number
            public static PROPERTY_MAX_VALUE : number
            public static PROPERTY_Min_VALUE : number
            public static CollisionMaterialSharpFlag : number
            public static HardnessCap_Sword : number
            public static HardnessCap_Bullet : number
            public static HardnessCap_LaserGun : number
            public static HardnessCap_Fist : number
            public static HardnessCap_Explosion : number
            public get Color(): UnityEngine.Color;
            public set Color(value: UnityEngine.Color);
            public get ColorRaw(): number;
            public get ID(): number;
            public set ID(value: number);
            public get Value(): number;
            public set Value(value: number);
            public get Weights(): number;
            public set Weights(value: number);
            public static GetSize () : number
            public static PackColor ($r: number, $g: number, $b: number, $value: $Ref<number>) : void
            public static UnpackIDFromInteger ($intValue: number) : number
            public SetColor ($color: Unity.Mathematics.float3) : void
            public GetColor () : UnityEngine.Color
            public CopyColor ($otherData: VoxelPlayground.Engine.PointDataV2) : void
            public IsSharp () : boolean
            public SetSharp ($yes: boolean) : void
            public static PackCollisionMaterialId ($id: number, $sharp: boolean) : number
            public GetCollisionMaterialId () : number
            public SetNumber ($property: VoxelPlayground.Engine.PointDataV2.Property, $value: number) : void
            public GetNumber ($property: VoxelPlayground.Engine.PointDataV2.Property) : number
            public GetPropertyValueNormalized ($property: VoxelPlayground.Engine.PointDataV2.Property) : number
            public StoreOriginalColor () : void
            public ProgressivelyRestoreOriginalColor () : void
            public RestoreOriginalColor () : void
            public IsUnyielding () : boolean
            public SetUnyielding ($yes: boolean) : void
            public IsSolid () : boolean
            public static EmptyPoint () : VoxelPlayground.Engine.PointDataV2
            public InitDefaultValue () : void
            public CloneFrom ($other: VoxelPlayground.Engine.PointDataV2) : void
            public static SetHardnessTable ($hardness: System.Array$1<number>) : void
            public static SetToughnessTable ($toughness: System.Array$1<number>) : void
            public GetHardnessById ($id: number) : number
            public GetToughnessById ($id: number) : number
            public GetHardness () : number
            public GetToughness () : number
            public GetHardnessNormalize () : number
            public GetToughnessNormalize () : number
            public static CalcHardness2IntensityMlp ($hardnessCap: number, $selfHardness: number) : number
            public static GetHardnessAffectSize ($hardness: number) : number
            public static CalcToughnessRadiusMultiplier ($toughness: number) : number
            public constructor ($other: VoxelPlayground.Engine.PointDataV2)
            public constructor ($other: VoxelPlayground.Engine.PointData)
        }
        class PointData extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        class LayerMasksHelper extends System.Object
        {
            protected [__keep_incompatibility]: never;
            public static layerMask_Default : UnityEngine.LayerMask
            public static layerMask_HPTK : UnityEngine.LayerMask
            public static layerMask_Ragdoll : UnityEngine.LayerMask
            public static layerMask_Ragdoll_VRCam_Hide : UnityEngine.LayerMask
            public static layerMask_Projectile : UnityEngine.LayerMask
            public static layerMask_Item : UnityEngine.LayerMask
            public static layerMask_Item_Projectile_Ignore : UnityEngine.LayerMask
            public static layerMask_Building : UnityEngine.LayerMask
            public static layerMask_UI : UnityEngine.LayerMask
            public static layerMask_3DUI : UnityEngine.LayerMask
            public static layerMask_Attachable : UnityEngine.LayerMask
            public static layerMask_PingObj : UnityEngine.LayerMask
            public static layerMask_OverlayUi : UnityEngine.LayerMask
            public static layerMask_RacingGameTrigger : UnityEngine.LayerMask
            public static layerMask_FakeRagdoll : UnityEngine.LayerMask
            public static layerMask_EnergySwordCustom : UnityEngine.LayerMask
            public static layerMask_ControllerLine : UnityEngine.LayerMask
            public static layerMask_LCKTablet : UnityEngine.LayerMask
            public static layerMask_RaycastOnly : UnityEngine.LayerMask
            public static layer_Character_Controlled : number
            public static layer_Character : number
            public static tag_Floor : string
            public static gameplayTag_None : number
            public static gameplayTag_Stairs : number
            public static gameplayTag_Wall : number
            public static gameplayTag_Floor : number
            public static gameplayTag_Obstacle : number
            public static gameplayTag_Decoration : number
            public static gameplayTagMask_Obstacle : number
            public static bulletHitLayerMask : UnityEngine.LayerMask
            public static visualObjectsLayerMask : UnityEngine.LayerMask
            public static hzbNearCameraOcclusionBypassMask : UnityEngine.LayerMask
            public static grabMask : UnityEngine.LayerMask
            public static attachableLayer : UnityEngine.LayerMask
            public static uiMask : UnityEngine.LayerMask
            public static pinchMask : UnityEngine.LayerMask
            public static splatMask : UnityEngine.LayerMask
            public static splatMaskExcludeItem : UnityEngine.LayerMask
            public static blastMarkMask : UnityEngine.LayerMask
            public static cameraCollisionMask : UnityEngine.LayerMask
            public static shadowMask : UnityEngine.LayerMask
            public static HightlightRenderMask : number
            public static LCKHideMask : UnityEngine.LayerMask
            public static ChangeLayerRecursively ($gameObject: UnityEngine.GameObject, $newLayer: number) : void
        }
        class Utils extends System.Object
        {
            protected [__keep_incompatibility]: never;
            public static CollidersPool : System.Array$1<Px5.Unity.PxCollider>
        }
    }
    namespace VoxelPlayground.Entity {
        class Entity extends VoxelPlayground.Engine.SerializableMonoBehaviour implements VoxelPlayground.Gaming.IPinchable, System.IEquatable$1<VoxelPlayground.Entity.Entity>
        {
            protected [__keep_incompatibility]: never;
        }
        class EntityCharacter extends VoxelPlayground.Entity.Entity implements VoxelPlayground.Gaming.IPinchable, VoxelPlayground.Entity.ICombustible, System.IEquatable$1<VoxelPlayground.Entity.Entity>
        {
            protected [__keep_incompatibility]: never;
        }
        interface ICombustible
        {
        }
        interface IVehicle
        {
        }
        class EntityItem extends VoxelPlayground.Entity.Entity implements VoxelPlayground.Gaming.IPinchable, System.IEquatable$1<VoxelPlayground.Entity.Entity>
        {
            protected [__keep_incompatibility]: never;
        }
        class EntityAttachmentItem extends VoxelPlayground.Entity.EntityItem implements VoxelPlayground.Gaming.IPinchable, System.IEquatable$1<VoxelPlayground.Entity.Entity>
        {
            protected [__keep_incompatibility]: never;
        }
        class EntityFirableWeapon extends VoxelPlayground.Entity.EntityAttachmentItem implements VoxelPlayground.Gaming.IPinchable, System.IEquatable$1<VoxelPlayground.Entity.Entity>
        {
            protected [__keep_incompatibility]: never;
        }
        class EntityHoldWeapon extends VoxelPlayground.Entity.EntityFirableWeapon implements VoxelPlayground.Gaming.IPinchable, System.IEquatable$1<VoxelPlayground.Entity.Entity>
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace VoxelPlayground.Gaming {
        interface IPinchable
        {
        }
    }
    namespace System.Reflection {
        class MemberInfo extends System.Object implements System.Runtime.InteropServices._MemberInfo, System.Reflection.ICustomAttributeProvider
        {
            protected [__keep_incompatibility]: never;
        }
        interface ICustomAttributeProvider
        {
        }
        interface IReflect
        {
        }
        interface MemberFilter
        { 
        (m: System.Reflection.MemberInfo, filterCriteria: any) : boolean; 
        Invoke?: (m: System.Reflection.MemberInfo, filterCriteria: any) => boolean;
        }
        var MemberFilter: { new (func: (m: System.Reflection.MemberInfo, filterCriteria: any) => boolean): MemberFilter; }
        interface TypeFilter
        { 
        (m: System.Type, filterCriteria: any) : boolean; 
        Invoke?: (m: System.Type, filterCriteria: any) => boolean;
        }
        var TypeFilter: { new (func: (m: System.Type, filterCriteria: any) => boolean): TypeFilter; }
        enum MemberTypes
        { Constructor = 1, Event = 2, Field = 4, Method = 8, Property = 16, TypeInfo = 32, Custom = 64, NestedType = 128, All = 191 }
        enum BindingFlags
        { Default = 0, IgnoreCase = 1, DeclaredOnly = 2, Instance = 4, Static = 8, Public = 16, NonPublic = 32, FlattenHierarchy = 64, InvokeMethod = 256, CreateInstance = 512, GetField = 1024, SetField = 2048, GetProperty = 4096, SetProperty = 8192, PutDispProperty = 16384, PutRefDispProperty = 32768, ExactBinding = 65536, SuppressChangeType = 131072, OptionalParamBinding = 262144, IgnoreReturn = 16777216, DoNotWrapExceptions = 33554432 }
        class Assembly extends System.Object implements System.Runtime.Serialization.ISerializable, System.Reflection.ICustomAttributeProvider, System.Security.IEvidenceFactory, System.Runtime.InteropServices._Assembly
        {
            protected [__keep_incompatibility]: never;
        }
        class Module extends System.Object implements System.Runtime.Serialization.ISerializable, System.Runtime.InteropServices._Module, System.Reflection.ICustomAttributeProvider
        {
            protected [__keep_incompatibility]: never;
        }
        class MethodBase extends System.Reflection.MemberInfo implements System.Runtime.InteropServices._MemberInfo, System.Runtime.InteropServices._MethodBase, System.Reflection.ICustomAttributeProvider
        {
            protected [__keep_incompatibility]: never;
        }
        enum GenericParameterAttributes
        { None = 0, VarianceMask = 3, Covariant = 1, Contravariant = 2, SpecialConstraintMask = 28, ReferenceTypeConstraint = 4, NotNullableValueTypeConstraint = 8, DefaultConstructorConstraint = 16 }
        enum TypeAttributes
        { VisibilityMask = 7, NotPublic = 0, Public = 1, NestedPublic = 2, NestedPrivate = 3, NestedFamily = 4, NestedAssembly = 5, NestedFamANDAssem = 6, NestedFamORAssem = 7, LayoutMask = 24, AutoLayout = 0, SequentialLayout = 8, ExplicitLayout = 16, ClassSemanticsMask = 32, Class = 0, Interface = 32, Abstract = 128, Sealed = 256, SpecialName = 1024, Import = 4096, Serializable = 8192, WindowsRuntime = 16384, StringFormatMask = 196608, AnsiClass = 0, UnicodeClass = 65536, AutoClass = 131072, CustomFormatClass = 196608, CustomFormatMask = 12582912, BeforeFieldInit = 1048576, RTSpecialName = 2048, HasSecurity = 262144, ReservedMask = 264192 }
        class ConstructorInfo extends System.Reflection.MethodBase implements System.Runtime.InteropServices._MemberInfo, System.Runtime.InteropServices._MethodBase, System.Runtime.InteropServices._ConstructorInfo, System.Reflection.ICustomAttributeProvider
        {
            protected [__keep_incompatibility]: never;
        }
        class Binder extends System.Object
        {
            protected [__keep_incompatibility]: never;
        }
        class ParameterModifier extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        enum CallingConventions
        { Standard = 1, VarArgs = 2, Any = 3, HasThis = 32, ExplicitThis = 64 }
        class EventInfo extends System.Reflection.MemberInfo implements System.Runtime.InteropServices._MemberInfo, System.Runtime.InteropServices._EventInfo, System.Reflection.ICustomAttributeProvider
        {
            protected [__keep_incompatibility]: never;
        }
        class FieldInfo extends System.Reflection.MemberInfo implements System.Runtime.InteropServices._MemberInfo, System.Reflection.ICustomAttributeProvider, System.Runtime.InteropServices._FieldInfo
        {
            protected [__keep_incompatibility]: never;
        }
        class MethodInfo extends System.Reflection.MethodBase implements System.Runtime.InteropServices._MemberInfo, System.Runtime.InteropServices._MethodBase, System.Runtime.InteropServices._MethodInfo, System.Reflection.ICustomAttributeProvider
        {
            protected [__keep_incompatibility]: never;
        }
        class PropertyInfo extends System.Reflection.MemberInfo implements System.Runtime.InteropServices._PropertyInfo, System.Runtime.InteropServices._MemberInfo, System.Reflection.ICustomAttributeProvider
        {
            protected [__keep_incompatibility]: never;
        }
        class InterfaceMapping extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        class AssemblyName extends System.Object implements System.Runtime.InteropServices._AssemblyName, System.Runtime.Serialization.IDeserializationCallback, System.Runtime.Serialization.ISerializable, System.ICloneable
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace System.Runtime.InteropServices {
        interface _MemberInfo
        {
        }
        interface _Type
        {
        }
        interface _Exception
        {
        }
        interface _Assembly
        {
        }
        interface _Module
        {
        }
        interface _MethodBase
        {
        }
        interface _Attribute
        {
        }
        class StructLayoutAttribute extends System.Attribute implements System.Runtime.InteropServices._Attribute
        {
            protected [__keep_incompatibility]: never;
        }
        interface _ConstructorInfo
        {
        }
        interface _EventInfo
        {
        }
        interface _FieldInfo
        {
        }
        interface _MethodInfo
        {
        }
        interface _PropertyInfo
        {
        }
        interface _AssemblyName
        {
        }
    }
    namespace System.Collections.Generic.Dictionary$2 {
        class KeyCollection<TKey, TValue> extends System.Object implements System.Collections.ICollection, System.Collections.Generic.IEnumerable$1<TKey>, System.Collections.IEnumerable, System.Collections.Generic.IReadOnlyCollection$1<TKey>, System.Collections.Generic.ICollection$1<TKey>
        {
            protected [__keep_incompatibility]: never;
            public [Symbol.iterator]() : IterableIterator<TKey>
        }
        class ValueCollection<TKey, TValue> extends System.Object implements System.Collections.ICollection, System.Collections.Generic.IEnumerable$1<TValue>, System.Collections.IEnumerable, System.Collections.Generic.IReadOnlyCollection$1<TValue>, System.Collections.Generic.ICollection$1<TValue>
        {
            protected [__keep_incompatibility]: never;
            public [Symbol.iterator]() : IterableIterator<TValue>
        }
        class Enumerator<TKey, TValue> extends System.ValueType implements System.Collections.IDictionaryEnumerator, System.Collections.Generic.IEnumerator$1<System.Collections.Generic.KeyValuePair$2<TKey, TValue>>, System.Collections.IEnumerator, System.IDisposable
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace UnityEngine.Events {
        /** Abstract base class for UnityEvents.
        */
        class UnityEventBase extends System.Object implements UnityEngine.ISerializationCallbackReceiver
        {
            protected [__keep_incompatibility]: never;
        }
        /** A zero argument persistent callback that can be saved with the Scene.
        */
        class UnityEvent extends UnityEngine.Events.UnityEventBase implements UnityEngine.ISerializationCallbackReceiver
        {
            protected [__keep_incompatibility]: never;
            /** Adds a non-persistent listener to the UnityEvent.
            * @param $call Callback function.
            */
            public AddListener ($call: UnityEngine.Events.UnityAction) : void
            /** Remove a non persistent listener from the UnityEvent. If you have added the same listener multiple times, this method will remove all occurrences of it.
            * @param $call Callback function.
            */
            public RemoveListener ($call: UnityEngine.Events.UnityAction) : void
            /** Invoke all registered callbacks (runtime and persistent).
            */
            public Invoke () : void
            public constructor ()
        }
        /** Zero argument delegate used by UnityEvents.
        */
        interface UnityAction
        { 
        () : void; 
        Invoke?: () => void;
        }
        var UnityAction: { new (func: () => void): UnityAction; }
        class UnityEvent$1<T0> extends UnityEngine.Events.UnityEventBase implements UnityEngine.ISerializationCallbackReceiver
        {
            protected [__keep_incompatibility]: never;
            public AddListener ($call: UnityEngine.Events.UnityAction$1<T0>) : void
            public RemoveListener ($call: UnityEngine.Events.UnityAction$1<T0>) : void
            public Invoke ($arg0: T0) : void
            public constructor ()
        }
        interface UnityAction$1<T0>
        { 
        (arg0: T0) : void; 
        Invoke?: (arg0: T0) => void;
        }
        class UnityEvent$3<T0, T1, T2> extends UnityEngine.Events.UnityEventBase implements UnityEngine.ISerializationCallbackReceiver
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace VoxelPlayground.Utility {
        class State extends System.Object
        {
            protected [__keep_incompatibility]: never;
        }
        class StateMachine extends VoxelPlayground.Engine.SerializableMonoBehaviour
        {
            protected [__keep_incompatibility]: never;
            public OnChangeState : UnityEngine.Events.UnityEvent$1<VoxelPlayground.Utility.State>
            public get previousState(): VoxelPlayground.Utility.State;
            public GetCurrentState () : VoxelPlayground.Utility.State
            public InitState ($state: VoxelPlayground.Utility.State) : void
            public ChangeState ($newState: VoxelPlayground.Utility.State) : void
            public Update () : void
            public FixedUpdate () : void
            public constructor ()
        }
        class Giz extends System.Object
        {
            protected [__keep_incompatibility]: never;
            public static show : boolean
            public static showSound : boolean
            public static showAI : boolean
            public static showUI : boolean
            public static showSkeleton : boolean
            public static showAttach : boolean
            public static showInput : boolean
            public static showRayHit : boolean
            public static verbose : boolean
            public static PushDuration ($duration: number) : void
            public static PopDuration () : void
            public static DrawBasis ($rot: UnityEngine.Quaternion, $pos: UnityEngine.Vector3, $len?: number, $brightness?: number, $lenMul?: number) : void
            public static DrawRay ($pos: UnityEngine.Vector3, $dir: UnityEngine.Vector3, $color?: UnityEngine.Color) : void
            public static DrawRayArrow ($pos: UnityEngine.Vector3, $dir: UnityEngine.Vector3, $color?: UnityEngine.Color) : void
            public static DrawCrosshair ($pos: UnityEngine.Vector3, $rot: UnityEngine.Quaternion, $size?: number, $color?: UnityEngine.Color) : void
            public static DrawLine ($start: UnityEngine.Vector3, $end: UnityEngine.Vector3, $color?: UnityEngine.Color) : void
            public static DrawArrow ($start: UnityEngine.Vector3, $end: UnityEngine.Vector3, $color?: UnityEngine.Color) : void
            public static DrawDashedLine ($start: UnityEngine.Vector3, $end: UnityEngine.Vector3, $dash: number, $gap: number, $color?: UnityEngine.Color) : void
            public static DrawLabel ($pos: UnityEngine.Vector3, $text: string, $color?: UnityEngine.Color, $sizeInPixels?: number) : void
            public static DrawWireSphere ($pos: UnityEngine.Vector3, $radius: number, $color?: UnityEngine.Color) : void
            public static DrawWireCapsule ($start: UnityEngine.Vector3, $end: UnityEngine.Vector3, $radius: number, $color?: UnityEngine.Color) : void
            public static DrawWireBox ($center: UnityEngine.Vector3, $rotation: UnityEngine.Quaternion, $size: UnityEngine.Vector3, $color?: UnityEngine.Color) : void
            public static DrawWireBox ($bounds: UnityEngine.Bounds, $rotation: UnityEngine.Quaternion, $color?: UnityEngine.Color) : void
            public constructor ()
        }
    }
    namespace VoxelPlayground.AI {
        class AIAction extends UnityEngine.ScriptableObject
        {
            protected [__keep_incompatibility]: never;
            public aiController : VoxelPlayground.AI.AIController
            public conditionType : VoxelPlayground.AI.ConditionType
            public considerations : System.Array$1<VoxelPlayground.AI.AIConsideration>
            public tickEveryFrame : boolean
            public OnEnterActoin () : void
            public OnExitActoin () : void
            public Tick () : void
            public constructor ()
        }
        class AIController extends VoxelPlayground.Engine.SerializableMonoBehaviour
        {
            protected [__keep_incompatibility]: never;
        }
        enum ConditionType
        { And = 0, Or = 1, Debug_AlwayTrue = 2, Debug_AlwayFalse = 3 }
        class AIConsideration extends UnityEngine.ScriptableObject
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace UnityEngine.RectInt {
        class PositionEnumerator extends System.ValueType implements System.Collections.Generic.IEnumerator$1<UnityEngine.Vector2Int>, System.Collections.IEnumerator, System.IDisposable
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace UnityEngine.BoundsInt {
        class PositionEnumerator extends System.ValueType implements System.Collections.Generic.IEnumerator$1<UnityEngine.Vector3Int>, System.Collections.IEnumerator, System.IDisposable
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace System.Threading {
        class CancellationToken extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace UnityEngine.SceneManagement {
        /** Run-time data structure for *.unity file.
        */
        class Scene extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace Unity.Collections {
        class NativeArray$1<T> extends System.ValueType implements System.Collections.Generic.IEnumerable$1<T>, System.Collections.IEnumerable, System.IDisposable, System.IEquatable$1<Unity.Collections.NativeArray$1<T>>
        {
            protected [__keep_incompatibility]: never;
            public [Symbol.iterator]() : IterableIterator<T>
        }
        class NativeSlice$1<T> extends System.ValueType implements System.Collections.Generic.IEnumerable$1<T>, System.Collections.IEnumerable, System.IEquatable$1<Unity.Collections.NativeSlice$1<T>>
        {
            protected [__keep_incompatibility]: never;
            public [Symbol.iterator]() : IterableIterator<T>
        }
    }
    namespace UnityEngine.Debug {
        class StartupLog extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace Unity.IntegerTime {
        /** Data type that represents time as an integer count of a rational number.
        */
        class RationalTime extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace UnityEngine.Random {
        class State extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace UnityEngine.Camera {
        interface CameraCallback
        { 
        (cam: UnityEngine.Camera) : void; 
        Invoke?: (cam: UnityEngine.Camera) => void;
        }
        var CameraCallback: { new (func: (cam: UnityEngine.Camera) => void): CameraCallback; }
        enum GateFitMode
        { Vertical = 1, Horizontal = 2, Fill = 3, Overscan = 4, None = 0 }
        enum MonoOrStereoscopicEye
        { Left = 0, Right = 1, Mono = 2 }
        class GateFitParameters extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        enum StereoscopicEye
        { Left = 0, Right = 1 }
        enum SceneViewFilterMode
        { Off = 0, ShowFiltered = 1 }
        class RenderRequest extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace UnityEngine.Rendering {
        /** Opaque object sorting mode of a Camera.
        */
        enum OpaqueSortMode
        { Default = 0, FrontToBack = 1, NoDistanceSort = 2 }
        /** Defines a place in camera's rendering to attach Rendering.CommandBuffer objects to.
        */
        enum CameraEvent
        { BeforeDepthTexture = 0, AfterDepthTexture = 1, BeforeDepthNormalsTexture = 2, AfterDepthNormalsTexture = 3, BeforeGBuffer = 4, AfterGBuffer = 5, BeforeLighting = 6, AfterLighting = 7, BeforeFinalPass = 8, AfterFinalPass = 9, BeforeForwardOpaque = 10, AfterForwardOpaque = 11, BeforeImageEffectsOpaque = 12, AfterImageEffectsOpaque = 13, BeforeSkybox = 14, AfterSkybox = 15, BeforeForwardAlpha = 16, AfterForwardAlpha = 17, BeforeImageEffects = 18, AfterImageEffects = 19, AfterEverything = 20, BeforeReflections = 21, AfterReflections = 22, BeforeHaloAndLensFlares = 23, AfterHaloAndLensFlares = 24 }
        /** List of graphics commands to execute.
        */
        class CommandBuffer extends System.Object implements System.IDisposable
        {
            protected [__keep_incompatibility]: never;
        }
        /** Describes the desired characteristics with respect to prioritisation and load balancing of the queue that a command buffer being submitted via Graphics.ExecuteCommandBufferAsync or [[ScriptableRenderContext.ExecuteCommandBufferAsync] should be sent to.
        */
        enum ComputeQueueType
        { Default = 0, Background = 1, Urgent = 2 }
        /** Parameters that configure a culling operation in the Scriptable Render Pipeline.
        */
        class ScriptableCullingParameters extends System.ValueType implements System.IEquatable$1<UnityEngine.Rendering.ScriptableCullingParameters>
        {
            protected [__keep_incompatibility]: never;
        }
        /** How shadows are cast from this object.
        */
        enum ShadowCastingMode
        { Off = 0, On = 1, TwoSided = 2, ShadowsOnly = 3 }
        /** Light probe interpolation type.
        */
        enum LightProbeUsage
        { Off = 0, BlendProbes = 1, UseProxyVolume = 2, CustomProvided = 4 }
        /** Reflection Probe usage.
        */
        enum ReflectionProbeUsage
        { Off = 0, BlendProbes = 1, BlendProbesAndSkybox = 2, Simple = 3 }
        /** Specifies how Unity builds the acceleration structure on the GPU.
        */
        enum RayTracingAccelerationStructureBuildFlags
        { None = 0, PreferFastTrace = 1, PreferFastBuild = 2, MinimizeMemory = 4 }
        /** ReflectionProbeBlendInfo contains information required for blending probes.
        */
        class ReflectionProbeBlendInfo extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        /** Represents a shader keyword declared in a shader source file.
        */
        class LocalKeyword extends System.ValueType implements System.IEquatable$1<UnityEngine.Rendering.LocalKeyword>
        {
            protected [__keep_incompatibility]: never;
        }
        /** Types of data that you can encapsulate within a render texture.
        */
        enum RenderTextureSubElement
        { Color = 0, Depth = 1, Stencil = 2, Default = 3 }
        /** Spherical harmonics up to the second order (3 bands, 9 coefficients).
        */
        class SphericalHarmonicsL2 extends System.ValueType implements System.IEquatable$1<UnityEngine.Rendering.SphericalHarmonicsL2>
        {
            protected [__keep_incompatibility]: never;
        }
        /** Format of the mesh index buffer data.
        */
        enum IndexFormat
        { UInt16 = 0, UInt32 = 1 }
        /** Information about a single VertexAttribute of a Mesh vertex.
        */
        class VertexAttributeDescriptor extends System.ValueType implements System.IEquatable$1<UnityEngine.Rendering.VertexAttributeDescriptor>
        {
            protected [__keep_incompatibility]: never;
        }
        /** Possible attribute types that describe a vertex in a Mesh.
        */
        enum VertexAttribute
        { Position = 0, Normal = 1, Tangent = 2, Color = 3, TexCoord0 = 4, TexCoord1 = 5, TexCoord2 = 6, TexCoord3 = 7, TexCoord4 = 8, TexCoord5 = 9, TexCoord6 = 10, TexCoord7 = 11, BlendWeight = 12, BlendIndices = 13 }
        /** Data type of a VertexAttribute.
        */
        enum VertexAttributeFormat
        { Float32 = 0, Float16 = 1, UNorm8 = 2, SNorm8 = 3, UNorm16 = 4, SNorm16 = 5, UInt8 = 6, SInt8 = 7, UInt16 = 8, SInt16 = 9, UInt32 = 10, SInt32 = 11 }
        /** Contains information about a single sub-mesh of a Mesh.
        */
        class SubMeshDescriptor extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        /** Mesh data update flags.
        */
        enum MeshUpdateFlags
        { Default = 0, DontValidateIndices = 1, DontResetBoneBounds = 2, DontNotifyMeshUsers = 4, DontRecalculateBounds = 8 }
        /** Determines the data that Unity returns when you call Mesh.GetBlendShapeBuffer.
        */
        enum BlendShapeBufferLayout
        { PerShape = 0, PerVertex = 1 }
        /** The unit of a Light's intensity.
        */
        enum LightUnit
        { Lumen = 0, Candela = 1, Lux = 2, Nits = 3, Ev100 = 4 }
        /** Shadow resolution options for a Light.
        */
        enum LightShadowResolution
        { FromQualitySettings = -1, Low = 0, Medium = 1, High = 2, VeryHigh = 3 }
        /** Defines a place in light's rendering to attach Rendering.CommandBuffer objects to.
        */
        enum LightEvent
        { BeforeShadowMap = 0, AfterShadowMap = 1, BeforeScreenspaceMask = 2, AfterScreenspaceMask = 3, BeforeShadowMapPass = 4, AfterShadowMapPass = 5 }
        /** Allows precise control over which shadow map passes to execute Rendering.CommandBuffer objects attached using Light.AddCommandBuffer.
        */
        enum ShadowMapPass
        { PointlightPositiveX = 1, PointlightNegativeX = 2, PointlightPositiveY = 4, PointlightNegativeY = 8, PointlightPositiveZ = 16, PointlightNegativeZ = 32, DirectionalCascade0 = 64, DirectionalCascade1 = 128, DirectionalCascade2 = 256, DirectionalCascade3 = 512, Spotlight = 1024, AreaLight = 2048, Pointlight = 63, Directional = 960, All = 2047 }
        /** Texture "dimension" (type).
        */
        enum TextureDimension
        { Unknown = -1, None = 0, Any = 1, Tex2D = 2, Tex3D = 3, Cube = 4, Tex2DArray = 5, CubeArray = 6 }
        /** Represents the view on a single texture resource that is uploaded to the graphics device.
        */
        class GraphicsTexture extends System.Object implements System.IDisposable
        {
            protected [__keep_incompatibility]: never;
        }
        enum ShaderHardwareTier
        { Tier1 = 0, Tier2 = 1, Tier3 = 2 }
        /** Represents a global shader keyword.
        */
        class GlobalKeyword extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        /** Represents the local keyword space of a Shader or ComputeShader.
        */
        class LocalKeywordSpace extends System.ValueType implements System.IEquatable$1<UnityEngine.Rendering.LocalKeywordSpace>
        {
            protected [__keep_incompatibility]: never;
        }
        /** Shader tag ids are used to refer to various names in shaders.
        */
        class ShaderTagId extends System.ValueType implements System.IEquatable$1<UnityEngine.Rendering.ShaderTagId>
        {
            protected [__keep_incompatibility]: never;
        }
        /** A data structure used to represent the geometry in the Scene for GPU ray tracing.
        */
        class RayTracingAccelerationStructure extends System.Object implements System.IDisposable
        {
            protected [__keep_incompatibility]: never;
        }
        /** Type of a given shader property.
        */
        enum ShaderPropertyType
        { Color = 0, Vector = 1, Float = 2, Range = 3, Texture = 4, Int = 5 }
        /** Flags that control how a shader property behaves.
        */
        enum ShaderPropertyFlags
        { None = 0, HideInInspector = 1, PerRendererData = 2, NoScaleOffset = 4, Normal = 8, HDR = 16, Gamma = 32, NonModifiableTextureData = 64, MainTexture = 128, MainColor = 256 }
        /** A flag representing each UV channel.
        */
        enum UVChannelFlags
        { UV0 = 1, UV1 = 2, UV2 = 4, UV3 = 8 }
    }
    namespace UnityEngine.Experimental.Rendering {
        /** Indicates how a Renderer is updated.
        */
        enum RayTracingMode
        { Off = 0, Static = 1, DynamicTransform = 2, DynamicGeometry = 3 }
        /** Use this format to create either Textures or RenderTextures from scripts.
        */
        enum GraphicsFormat
        { None = 0, R8_SRGB = 1, R8G8_SRGB = 2, R8G8B8_SRGB = 3, R8G8B8A8_SRGB = 4, R8_UNorm = 5, R8G8_UNorm = 6, R8G8B8_UNorm = 7, R8G8B8A8_UNorm = 8, R8_SNorm = 9, R8G8_SNorm = 10, R8G8B8_SNorm = 11, R8G8B8A8_SNorm = 12, R8_UInt = 13, R8G8_UInt = 14, R8G8B8_UInt = 15, R8G8B8A8_UInt = 16, R8_SInt = 17, R8G8_SInt = 18, R8G8B8_SInt = 19, R8G8B8A8_SInt = 20, R16_UNorm = 21, R16G16_UNorm = 22, R16G16B16_UNorm = 23, R16G16B16A16_UNorm = 24, R16_SNorm = 25, R16G16_SNorm = 26, R16G16B16_SNorm = 27, R16G16B16A16_SNorm = 28, R16_UInt = 29, R16G16_UInt = 30, R16G16B16_UInt = 31, R16G16B16A16_UInt = 32, R16_SInt = 33, R16G16_SInt = 34, R16G16B16_SInt = 35, R16G16B16A16_SInt = 36, R32_UInt = 37, R32G32_UInt = 38, R32G32B32_UInt = 39, R32G32B32A32_UInt = 40, R32_SInt = 41, R32G32_SInt = 42, R32G32B32_SInt = 43, R32G32B32A32_SInt = 44, R16_SFloat = 45, R16G16_SFloat = 46, R16G16B16_SFloat = 47, R16G16B16A16_SFloat = 48, R32_SFloat = 49, R32G32_SFloat = 50, R32G32B32_SFloat = 51, R32G32B32A32_SFloat = 52, B8G8R8_SRGB = 56, B8G8R8A8_SRGB = 57, B8G8R8_UNorm = 58, B8G8R8A8_UNorm = 59, B8G8R8_SNorm = 60, B8G8R8A8_SNorm = 61, B8G8R8_UInt = 62, B8G8R8A8_UInt = 63, B8G8R8_SInt = 64, B8G8R8A8_SInt = 65, R4G4B4A4_UNormPack16 = 66, B4G4R4A4_UNormPack16 = 67, R5G6B5_UNormPack16 = 68, B5G6R5_UNormPack16 = 69, R5G5B5A1_UNormPack16 = 70, B5G5R5A1_UNormPack16 = 71, A1R5G5B5_UNormPack16 = 72, E5B9G9R9_UFloatPack32 = 73, B10G11R11_UFloatPack32 = 74, A2B10G10R10_UNormPack32 = 75, A2B10G10R10_UIntPack32 = 76, A2B10G10R10_SIntPack32 = 77, A2R10G10B10_UNormPack32 = 78, A2R10G10B10_UIntPack32 = 79, A2R10G10B10_SIntPack32 = 80, A2R10G10B10_XRSRGBPack32 = 81, A2R10G10B10_XRUNormPack32 = 82, R10G10B10_XRSRGBPack32 = 83, R10G10B10_XRUNormPack32 = 84, A10R10G10B10_XRSRGBPack32 = 85, A10R10G10B10_XRUNormPack32 = 86, D16_UNorm = 90, D24_UNorm = 91, D24_UNorm_S8_UInt = 92, D32_SFloat = 93, D32_SFloat_S8_UInt = 94, S8_UInt = 95, RGB_DXT1_SRGB = 96, RGBA_DXT1_SRGB = 96, RGB_DXT1_UNorm = 97, RGBA_DXT1_UNorm = 97, RGBA_DXT3_SRGB = 98, RGBA_DXT3_UNorm = 99, RGBA_DXT5_SRGB = 100, RGBA_DXT5_UNorm = 101, R_BC4_UNorm = 102, R_BC4_SNorm = 103, RG_BC5_UNorm = 104, RG_BC5_SNorm = 105, RGB_BC6H_UFloat = 106, RGB_BC6H_SFloat = 107, RGBA_BC7_SRGB = 108, RGBA_BC7_UNorm = 109, RGB_PVRTC_2Bpp_SRGB = 110, RGB_PVRTC_2Bpp_UNorm = 111, RGB_PVRTC_4Bpp_SRGB = 112, RGB_PVRTC_4Bpp_UNorm = 113, RGBA_PVRTC_2Bpp_SRGB = 114, RGBA_PVRTC_2Bpp_UNorm = 115, RGBA_PVRTC_4Bpp_SRGB = 116, RGBA_PVRTC_4Bpp_UNorm = 117, RGB_ETC_UNorm = 118, RGB_ETC2_SRGB = 119, RGB_ETC2_UNorm = 120, RGB_A1_ETC2_SRGB = 121, RGB_A1_ETC2_UNorm = 122, RGBA_ETC2_SRGB = 123, RGBA_ETC2_UNorm = 124, R_EAC_UNorm = 125, R_EAC_SNorm = 126, RG_EAC_UNorm = 127, RG_EAC_SNorm = 128, RGBA_ASTC4X4_SRGB = 129, RGBA_ASTC4X4_UNorm = 130, RGBA_ASTC5X5_SRGB = 131, RGBA_ASTC5X5_UNorm = 132, RGBA_ASTC6X6_SRGB = 133, RGBA_ASTC6X6_UNorm = 134, RGBA_ASTC8X8_SRGB = 135, RGBA_ASTC8X8_UNorm = 136, RGBA_ASTC10X10_SRGB = 137, RGBA_ASTC10X10_UNorm = 138, RGBA_ASTC12X12_SRGB = 139, RGBA_ASTC12X12_UNorm = 140, YUV2 = 141, DepthAuto = 142, ShadowAuto = 143, VideoAuto = 144, RGBA_ASTC4X4_UFloat = 145, RGBA_ASTC5X5_UFloat = 146, RGBA_ASTC6X6_UFloat = 147, RGBA_ASTC8X8_UFloat = 148, RGBA_ASTC10X10_UFloat = 149, RGBA_ASTC12X12_UFloat = 150, D16_UNorm_S8_UInt = 151 }
        /** 
        Use a default format to create either Textures or RenderTextures from scripts based on platform specific capability.
        */
        enum DefaultFormat
        { LDR = 0, HDR = 1, DepthStencil = 2, Shadow = 3, Video = 4 }
        enum TextureCreationFlags
        { None = 0, MipChain = 1, DontInitializePixels = 4, Crunch = 64, DontUploadUponCreate = 1024, IgnoreMipmapLimit = 2048 }
    }
    namespace UnityEngine.GraphicsBuffer {
        enum Target
        { Vertex = 1, Index = 2, CopySource = 4, CopyDestination = 8, Structured = 16, Raw = 32, Append = 64, Counter = 128, IndirectArguments = 256, Constant = 512 }
    }
    namespace UnityEngine.Mesh {
        class MeshDataArray extends System.ValueType implements System.IDisposable
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace UnityEngine.ParticleSystem {
        class Particle extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        class PlaybackState extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        class Trails extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        class EmitParams extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        class MainModule extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            public get emitterVelocity(): UnityEngine.Vector3;
            public set emitterVelocity(value: UnityEngine.Vector3);
            public get duration(): number;
            public set duration(value: number);
            public get loop(): boolean;
            public set loop(value: boolean);
            public get prewarm(): boolean;
            public set prewarm(value: boolean);
            public get startDelay(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set startDelay(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get startDelayMultiplier(): number;
            public set startDelayMultiplier(value: number);
            public get startLifetime(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set startLifetime(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get startLifetimeMultiplier(): number;
            public set startLifetimeMultiplier(value: number);
            public get startSpeed(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set startSpeed(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get startSpeedMultiplier(): number;
            public set startSpeedMultiplier(value: number);
            public get startSize3D(): boolean;
            public set startSize3D(value: boolean);
            public get startSize(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set startSize(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get startSizeMultiplier(): number;
            public set startSizeMultiplier(value: number);
            public get startSizeX(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set startSizeX(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get startSizeXMultiplier(): number;
            public set startSizeXMultiplier(value: number);
            public get startSizeY(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set startSizeY(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get startSizeYMultiplier(): number;
            public set startSizeYMultiplier(value: number);
            public get startSizeZ(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set startSizeZ(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get startSizeZMultiplier(): number;
            public set startSizeZMultiplier(value: number);
            public get startRotation3D(): boolean;
            public set startRotation3D(value: boolean);
            public get startRotation(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set startRotation(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get startRotationMultiplier(): number;
            public set startRotationMultiplier(value: number);
            public get startRotationX(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set startRotationX(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get startRotationXMultiplier(): number;
            public set startRotationXMultiplier(value: number);
            public get startRotationY(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set startRotationY(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get startRotationYMultiplier(): number;
            public set startRotationYMultiplier(value: number);
            public get startRotationZ(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set startRotationZ(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get startRotationZMultiplier(): number;
            public set startRotationZMultiplier(value: number);
            public get flipRotation(): number;
            public set flipRotation(value: number);
            public get startColor(): UnityEngine.ParticleSystem.MinMaxGradient;
            public set startColor(value: UnityEngine.ParticleSystem.MinMaxGradient);
            public get gravitySource(): UnityEngine.ParticleSystemGravitySource;
            public set gravitySource(value: UnityEngine.ParticleSystemGravitySource);
            public get gravityModifier(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set gravityModifier(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get gravityModifierMultiplier(): number;
            public set gravityModifierMultiplier(value: number);
            public get simulationSpace(): UnityEngine.ParticleSystemSimulationSpace;
            public set simulationSpace(value: UnityEngine.ParticleSystemSimulationSpace);
            public get customSimulationSpace(): UnityEngine.Transform;
            public set customSimulationSpace(value: UnityEngine.Transform);
            public get simulationSpeed(): number;
            public set simulationSpeed(value: number);
            public get useUnscaledTime(): boolean;
            public set useUnscaledTime(value: boolean);
            public get scalingMode(): UnityEngine.ParticleSystemScalingMode;
            public set scalingMode(value: UnityEngine.ParticleSystemScalingMode);
            public get playOnAwake(): boolean;
            public set playOnAwake(value: boolean);
            public get maxParticles(): number;
            public set maxParticles(value: number);
            public get emitterVelocityMode(): UnityEngine.ParticleSystemEmitterVelocityMode;
            public set emitterVelocityMode(value: UnityEngine.ParticleSystemEmitterVelocityMode);
            public get stopAction(): UnityEngine.ParticleSystemStopAction;
            public set stopAction(value: UnityEngine.ParticleSystemStopAction);
            public get ringBufferMode(): UnityEngine.ParticleSystemRingBufferMode;
            public set ringBufferMode(value: UnityEngine.ParticleSystemRingBufferMode);
            public get ringBufferLoopRange(): UnityEngine.Vector2;
            public set ringBufferLoopRange(value: UnityEngine.Vector2);
            public get cullingMode(): UnityEngine.ParticleSystemCullingMode;
            public set cullingMode(value: UnityEngine.ParticleSystemCullingMode);
        }
        class EmissionModule extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            public get enabled(): boolean;
            public set enabled(value: boolean);
            public get rateOverTime(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set rateOverTime(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get rateOverTimeMultiplier(): number;
            public set rateOverTimeMultiplier(value: number);
            public get rateOverDistance(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set rateOverDistance(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get rateOverDistanceMultiplier(): number;
            public set rateOverDistanceMultiplier(value: number);
            public get burstCount(): number;
            public set burstCount(value: number);
            public SetBursts ($bursts: System.Array$1<UnityEngine.ParticleSystem.Burst>) : void
            public SetBursts ($bursts: System.Array$1<UnityEngine.ParticleSystem.Burst>, $size: number) : void
            public GetBursts ($bursts: System.Array$1<UnityEngine.ParticleSystem.Burst>) : number
            public SetBurst ($index: number, $burst: UnityEngine.ParticleSystem.Burst) : void
            public GetBurst ($index: number) : UnityEngine.ParticleSystem.Burst
        }
        class ShapeModule extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            public get enabled(): boolean;
            public set enabled(value: boolean);
            public get shapeType(): UnityEngine.ParticleSystemShapeType;
            public set shapeType(value: UnityEngine.ParticleSystemShapeType);
            public get randomDirectionAmount(): number;
            public set randomDirectionAmount(value: number);
            public get sphericalDirectionAmount(): number;
            public set sphericalDirectionAmount(value: number);
            public get randomPositionAmount(): number;
            public set randomPositionAmount(value: number);
            public get alignToDirection(): boolean;
            public set alignToDirection(value: boolean);
            public get radius(): number;
            public set radius(value: number);
            public get radiusMode(): UnityEngine.ParticleSystemShapeMultiModeValue;
            public set radiusMode(value: UnityEngine.ParticleSystemShapeMultiModeValue);
            public get radiusSpread(): number;
            public set radiusSpread(value: number);
            public get radiusSpeed(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set radiusSpeed(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get radiusSpeedMultiplier(): number;
            public set radiusSpeedMultiplier(value: number);
            public get radiusThickness(): number;
            public set radiusThickness(value: number);
            public get angle(): number;
            public set angle(value: number);
            public get length(): number;
            public set length(value: number);
            public get boxThickness(): UnityEngine.Vector3;
            public set boxThickness(value: UnityEngine.Vector3);
            public get meshShapeType(): UnityEngine.ParticleSystemMeshShapeType;
            public set meshShapeType(value: UnityEngine.ParticleSystemMeshShapeType);
            public get mesh(): UnityEngine.Mesh;
            public set mesh(value: UnityEngine.Mesh);
            public get meshRenderer(): UnityEngine.MeshRenderer;
            public set meshRenderer(value: UnityEngine.MeshRenderer);
            public get skinnedMeshRenderer(): UnityEngine.SkinnedMeshRenderer;
            public set skinnedMeshRenderer(value: UnityEngine.SkinnedMeshRenderer);
            public get sprite(): UnityEngine.Sprite;
            public set sprite(value: UnityEngine.Sprite);
            public get spriteRenderer(): UnityEngine.SpriteRenderer;
            public set spriteRenderer(value: UnityEngine.SpriteRenderer);
            public get useMeshMaterialIndex(): boolean;
            public set useMeshMaterialIndex(value: boolean);
            public get meshMaterialIndex(): number;
            public set meshMaterialIndex(value: number);
            public get useMeshColors(): boolean;
            public set useMeshColors(value: boolean);
            public get normalOffset(): number;
            public set normalOffset(value: number);
            public get meshSpawnMode(): UnityEngine.ParticleSystemShapeMultiModeValue;
            public set meshSpawnMode(value: UnityEngine.ParticleSystemShapeMultiModeValue);
            public get meshSpawnSpread(): number;
            public set meshSpawnSpread(value: number);
            public get meshSpawnSpeed(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set meshSpawnSpeed(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get meshSpawnSpeedMultiplier(): number;
            public set meshSpawnSpeedMultiplier(value: number);
            public get arc(): number;
            public set arc(value: number);
            public get arcMode(): UnityEngine.ParticleSystemShapeMultiModeValue;
            public set arcMode(value: UnityEngine.ParticleSystemShapeMultiModeValue);
            public get arcSpread(): number;
            public set arcSpread(value: number);
            public get arcSpeed(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set arcSpeed(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get arcSpeedMultiplier(): number;
            public set arcSpeedMultiplier(value: number);
            public get donutRadius(): number;
            public set donutRadius(value: number);
            public get position(): UnityEngine.Vector3;
            public set position(value: UnityEngine.Vector3);
            public get rotation(): UnityEngine.Vector3;
            public set rotation(value: UnityEngine.Vector3);
            public get scale(): UnityEngine.Vector3;
            public set scale(value: UnityEngine.Vector3);
            public get texture(): UnityEngine.Texture2D;
            public set texture(value: UnityEngine.Texture2D);
            public get textureClipChannel(): UnityEngine.ParticleSystemShapeTextureChannel;
            public set textureClipChannel(value: UnityEngine.ParticleSystemShapeTextureChannel);
            public get textureClipThreshold(): number;
            public set textureClipThreshold(value: number);
            public get textureColorAffectsParticles(): boolean;
            public set textureColorAffectsParticles(value: boolean);
            public get textureAlphaAffectsParticles(): boolean;
            public set textureAlphaAffectsParticles(value: boolean);
            public get textureBilinearFiltering(): boolean;
            public set textureBilinearFiltering(value: boolean);
            public get textureUVChannel(): number;
            public set textureUVChannel(value: number);
        }
        class VelocityOverLifetimeModule extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            public get enabled(): boolean;
            public set enabled(value: boolean);
            public get x(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set x(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get y(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set y(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get z(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set z(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get xMultiplier(): number;
            public set xMultiplier(value: number);
            public get yMultiplier(): number;
            public set yMultiplier(value: number);
            public get zMultiplier(): number;
            public set zMultiplier(value: number);
            public get orbitalX(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set orbitalX(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get orbitalY(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set orbitalY(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get orbitalZ(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set orbitalZ(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get orbitalXMultiplier(): number;
            public set orbitalXMultiplier(value: number);
            public get orbitalYMultiplier(): number;
            public set orbitalYMultiplier(value: number);
            public get orbitalZMultiplier(): number;
            public set orbitalZMultiplier(value: number);
            public get orbitalOffsetX(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set orbitalOffsetX(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get orbitalOffsetY(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set orbitalOffsetY(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get orbitalOffsetZ(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set orbitalOffsetZ(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get orbitalOffsetXMultiplier(): number;
            public set orbitalOffsetXMultiplier(value: number);
            public get orbitalOffsetYMultiplier(): number;
            public set orbitalOffsetYMultiplier(value: number);
            public get orbitalOffsetZMultiplier(): number;
            public set orbitalOffsetZMultiplier(value: number);
            public get radial(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set radial(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get radialMultiplier(): number;
            public set radialMultiplier(value: number);
            public get speedModifier(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set speedModifier(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get speedModifierMultiplier(): number;
            public set speedModifierMultiplier(value: number);
            public get space(): UnityEngine.ParticleSystemSimulationSpace;
            public set space(value: UnityEngine.ParticleSystemSimulationSpace);
        }
        class LimitVelocityOverLifetimeModule extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            public get enabled(): boolean;
            public set enabled(value: boolean);
            public get limitX(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set limitX(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get limitXMultiplier(): number;
            public set limitXMultiplier(value: number);
            public get limitY(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set limitY(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get limitYMultiplier(): number;
            public set limitYMultiplier(value: number);
            public get limitZ(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set limitZ(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get limitZMultiplier(): number;
            public set limitZMultiplier(value: number);
            public get limit(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set limit(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get limitMultiplier(): number;
            public set limitMultiplier(value: number);
            public get dampen(): number;
            public set dampen(value: number);
            public get separateAxes(): boolean;
            public set separateAxes(value: boolean);
            public get space(): UnityEngine.ParticleSystemSimulationSpace;
            public set space(value: UnityEngine.ParticleSystemSimulationSpace);
            public get drag(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set drag(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get dragMultiplier(): number;
            public set dragMultiplier(value: number);
            public get multiplyDragByParticleSize(): boolean;
            public set multiplyDragByParticleSize(value: boolean);
            public get multiplyDragByParticleVelocity(): boolean;
            public set multiplyDragByParticleVelocity(value: boolean);
        }
        class InheritVelocityModule extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            public get enabled(): boolean;
            public set enabled(value: boolean);
            public get mode(): UnityEngine.ParticleSystemInheritVelocityMode;
            public set mode(value: UnityEngine.ParticleSystemInheritVelocityMode);
            public get curve(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set curve(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get curveMultiplier(): number;
            public set curveMultiplier(value: number);
        }
        class LifetimeByEmitterSpeedModule extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        class ForceOverLifetimeModule extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        class ColorOverLifetimeModule extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            public get enabled(): boolean;
            public set enabled(value: boolean);
            public get color(): UnityEngine.ParticleSystem.MinMaxGradient;
            public set color(value: UnityEngine.ParticleSystem.MinMaxGradient);
        }
        class ColorBySpeedModule extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            public get enabled(): boolean;
            public set enabled(value: boolean);
            public get color(): UnityEngine.ParticleSystem.MinMaxGradient;
            public set color(value: UnityEngine.ParticleSystem.MinMaxGradient);
            public get range(): UnityEngine.Vector2;
            public set range(value: UnityEngine.Vector2);
        }
        class SizeOverLifetimeModule extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            public get enabled(): boolean;
            public set enabled(value: boolean);
            public get size(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set size(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get sizeMultiplier(): number;
            public set sizeMultiplier(value: number);
            public get x(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set x(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get xMultiplier(): number;
            public set xMultiplier(value: number);
            public get y(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set y(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get yMultiplier(): number;
            public set yMultiplier(value: number);
            public get z(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set z(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get zMultiplier(): number;
            public set zMultiplier(value: number);
            public get separateAxes(): boolean;
            public set separateAxes(value: boolean);
        }
        class SizeBySpeedModule extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            public get enabled(): boolean;
            public set enabled(value: boolean);
            public get size(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set size(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get sizeMultiplier(): number;
            public set sizeMultiplier(value: number);
            public get x(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set x(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get xMultiplier(): number;
            public set xMultiplier(value: number);
            public get y(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set y(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get yMultiplier(): number;
            public set yMultiplier(value: number);
            public get z(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set z(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get zMultiplier(): number;
            public set zMultiplier(value: number);
            public get separateAxes(): boolean;
            public set separateAxes(value: boolean);
            public get range(): UnityEngine.Vector2;
            public set range(value: UnityEngine.Vector2);
        }
        class RotationOverLifetimeModule extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            public get enabled(): boolean;
            public set enabled(value: boolean);
            public get x(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set x(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get xMultiplier(): number;
            public set xMultiplier(value: number);
            public get y(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set y(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get yMultiplier(): number;
            public set yMultiplier(value: number);
            public get z(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set z(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get zMultiplier(): number;
            public set zMultiplier(value: number);
            public get separateAxes(): boolean;
            public set separateAxes(value: boolean);
        }
        class RotationBySpeedModule extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            public get enabled(): boolean;
            public set enabled(value: boolean);
            public get x(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set x(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get xMultiplier(): number;
            public set xMultiplier(value: number);
            public get y(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set y(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get yMultiplier(): number;
            public set yMultiplier(value: number);
            public get z(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set z(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get zMultiplier(): number;
            public set zMultiplier(value: number);
            public get separateAxes(): boolean;
            public set separateAxes(value: boolean);
            public get range(): UnityEngine.Vector2;
            public set range(value: UnityEngine.Vector2);
        }
        class ExternalForcesModule extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            public get enabled(): boolean;
            public set enabled(value: boolean);
            public get multiplier(): number;
            public set multiplier(value: number);
            public get multiplierCurve(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set multiplierCurve(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get influenceFilter(): UnityEngine.ParticleSystemGameObjectFilter;
            public set influenceFilter(value: UnityEngine.ParticleSystemGameObjectFilter);
            public get influenceMask(): UnityEngine.LayerMask;
            public set influenceMask(value: UnityEngine.LayerMask);
            public get influenceCount(): number;
            public IsAffectedBy ($field: UnityEngine.ParticleSystemForceField) : boolean
            public AddInfluence ($field: UnityEngine.ParticleSystemForceField) : void
            public RemoveInfluence ($index: number) : void
            public RemoveInfluence ($field: UnityEngine.ParticleSystemForceField) : void
            public RemoveAllInfluences () : void
            public SetInfluence ($index: number, $field: UnityEngine.ParticleSystemForceField) : void
            public GetInfluence ($index: number) : UnityEngine.ParticleSystemForceField
        }
        class NoiseModule extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            public get enabled(): boolean;
            public set enabled(value: boolean);
            public get separateAxes(): boolean;
            public set separateAxes(value: boolean);
            public get strength(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set strength(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get strengthMultiplier(): number;
            public set strengthMultiplier(value: number);
            public get strengthX(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set strengthX(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get strengthXMultiplier(): number;
            public set strengthXMultiplier(value: number);
            public get strengthY(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set strengthY(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get strengthYMultiplier(): number;
            public set strengthYMultiplier(value: number);
            public get strengthZ(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set strengthZ(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get strengthZMultiplier(): number;
            public set strengthZMultiplier(value: number);
            public get frequency(): number;
            public set frequency(value: number);
            public get damping(): boolean;
            public set damping(value: boolean);
            public get octaveCount(): number;
            public set octaveCount(value: number);
            public get octaveMultiplier(): number;
            public set octaveMultiplier(value: number);
            public get octaveScale(): number;
            public set octaveScale(value: number);
            public get quality(): UnityEngine.ParticleSystemNoiseQuality;
            public set quality(value: UnityEngine.ParticleSystemNoiseQuality);
            public get scrollSpeed(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set scrollSpeed(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get scrollSpeedMultiplier(): number;
            public set scrollSpeedMultiplier(value: number);
            public get remapEnabled(): boolean;
            public set remapEnabled(value: boolean);
            public get remap(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set remap(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get remapMultiplier(): number;
            public set remapMultiplier(value: number);
            public get remapX(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set remapX(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get remapXMultiplier(): number;
            public set remapXMultiplier(value: number);
            public get remapY(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set remapY(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get remapYMultiplier(): number;
            public set remapYMultiplier(value: number);
            public get remapZ(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set remapZ(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get remapZMultiplier(): number;
            public set remapZMultiplier(value: number);
            public get positionAmount(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set positionAmount(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get rotationAmount(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set rotationAmount(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get sizeAmount(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set sizeAmount(value: UnityEngine.ParticleSystem.MinMaxCurve);
        }
        class CollisionModule extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            public get enabled(): boolean;
            public set enabled(value: boolean);
            public get type(): UnityEngine.ParticleSystemCollisionType;
            public set type(value: UnityEngine.ParticleSystemCollisionType);
            public get mode(): UnityEngine.ParticleSystemCollisionMode;
            public set mode(value: UnityEngine.ParticleSystemCollisionMode);
            public get dampen(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set dampen(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get dampenMultiplier(): number;
            public set dampenMultiplier(value: number);
            public get bounce(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set bounce(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get bounceMultiplier(): number;
            public set bounceMultiplier(value: number);
            public get lifetimeLoss(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set lifetimeLoss(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get lifetimeLossMultiplier(): number;
            public set lifetimeLossMultiplier(value: number);
            public get minKillSpeed(): number;
            public set minKillSpeed(value: number);
            public get maxKillSpeed(): number;
            public set maxKillSpeed(value: number);
            public get collidesWith(): UnityEngine.LayerMask;
            public set collidesWith(value: UnityEngine.LayerMask);
            public get enableDynamicColliders(): boolean;
            public set enableDynamicColliders(value: boolean);
            public get maxCollisionShapes(): number;
            public set maxCollisionShapes(value: number);
            public get quality(): UnityEngine.ParticleSystemCollisionQuality;
            public set quality(value: UnityEngine.ParticleSystemCollisionQuality);
            public get voxelSize(): number;
            public set voxelSize(value: number);
            public get radiusScale(): number;
            public set radiusScale(value: number);
            public get sendCollisionMessages(): boolean;
            public set sendCollisionMessages(value: boolean);
            public get colliderForce(): number;
            public set colliderForce(value: number);
            public get multiplyColliderForceByCollisionAngle(): boolean;
            public set multiplyColliderForceByCollisionAngle(value: boolean);
            public get multiplyColliderForceByParticleSpeed(): boolean;
            public set multiplyColliderForceByParticleSpeed(value: boolean);
            public get multiplyColliderForceByParticleSize(): boolean;
            public set multiplyColliderForceByParticleSize(value: boolean);
            public get planeCount(): number;
            public AddPlane ($transform: UnityEngine.Transform) : void
            public RemovePlane ($index: number) : void
            public RemovePlane ($transform: UnityEngine.Transform) : void
            public SetPlane ($index: number, $transform: UnityEngine.Transform) : void
            public GetPlane ($index: number) : UnityEngine.Transform
        }
        class TriggerModule extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            public get enabled(): boolean;
            public set enabled(value: boolean);
            public get inside(): UnityEngine.ParticleSystemOverlapAction;
            public set inside(value: UnityEngine.ParticleSystemOverlapAction);
            public get outside(): UnityEngine.ParticleSystemOverlapAction;
            public set outside(value: UnityEngine.ParticleSystemOverlapAction);
            public get enter(): UnityEngine.ParticleSystemOverlapAction;
            public set enter(value: UnityEngine.ParticleSystemOverlapAction);
            public get exit(): UnityEngine.ParticleSystemOverlapAction;
            public set exit(value: UnityEngine.ParticleSystemOverlapAction);
            public get colliderQueryMode(): UnityEngine.ParticleSystemColliderQueryMode;
            public set colliderQueryMode(value: UnityEngine.ParticleSystemColliderQueryMode);
            public get radiusScale(): number;
            public set radiusScale(value: number);
            public get colliderCount(): number;
            public AddCollider ($collider: UnityEngine.Component) : void
            public RemoveCollider ($index: number) : void
            public RemoveCollider ($collider: UnityEngine.Component) : void
            public SetCollider ($index: number, $collider: UnityEngine.Component) : void
            public GetCollider ($index: number) : UnityEngine.Component
        }
        class SubEmittersModule extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            public get enabled(): boolean;
            public set enabled(value: boolean);
            public get subEmittersCount(): number;
            public AddSubEmitter ($subEmitter: UnityEngine.ParticleSystem, $type: UnityEngine.ParticleSystemSubEmitterType, $properties: UnityEngine.ParticleSystemSubEmitterProperties, $emitProbability: number) : void
            public AddSubEmitter ($subEmitter: UnityEngine.ParticleSystem, $type: UnityEngine.ParticleSystemSubEmitterType, $properties: UnityEngine.ParticleSystemSubEmitterProperties) : void
            public RemoveSubEmitter ($index: number) : void
            public RemoveSubEmitter ($subEmitter: UnityEngine.ParticleSystem) : void
            public SetSubEmitterSystem ($index: number, $subEmitter: UnityEngine.ParticleSystem) : void
            public SetSubEmitterType ($index: number, $type: UnityEngine.ParticleSystemSubEmitterType) : void
            public SetSubEmitterProperties ($index: number, $properties: UnityEngine.ParticleSystemSubEmitterProperties) : void
            public SetSubEmitterEmitProbability ($index: number, $emitProbability: number) : void
            public GetSubEmitterSystem ($index: number) : UnityEngine.ParticleSystem
            public GetSubEmitterType ($index: number) : UnityEngine.ParticleSystemSubEmitterType
            public GetSubEmitterProperties ($index: number) : UnityEngine.ParticleSystemSubEmitterProperties
            public GetSubEmitterEmitProbability ($index: number) : number
        }
        class TextureSheetAnimationModule extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            public get enabled(): boolean;
            public set enabled(value: boolean);
            public get mode(): UnityEngine.ParticleSystemAnimationMode;
            public set mode(value: UnityEngine.ParticleSystemAnimationMode);
            public get timeMode(): UnityEngine.ParticleSystemAnimationTimeMode;
            public set timeMode(value: UnityEngine.ParticleSystemAnimationTimeMode);
            public get fps(): number;
            public set fps(value: number);
            public get numTilesX(): number;
            public set numTilesX(value: number);
            public get numTilesY(): number;
            public set numTilesY(value: number);
            public get animation(): UnityEngine.ParticleSystemAnimationType;
            public set animation(value: UnityEngine.ParticleSystemAnimationType);
            public get rowMode(): UnityEngine.ParticleSystemAnimationRowMode;
            public set rowMode(value: UnityEngine.ParticleSystemAnimationRowMode);
            public get frameOverTime(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set frameOverTime(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get frameOverTimeMultiplier(): number;
            public set frameOverTimeMultiplier(value: number);
            public get startFrame(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set startFrame(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get startFrameMultiplier(): number;
            public set startFrameMultiplier(value: number);
            public get cycleCount(): number;
            public set cycleCount(value: number);
            public get rowIndex(): number;
            public set rowIndex(value: number);
            public get uvChannelMask(): UnityEngine.Rendering.UVChannelFlags;
            public set uvChannelMask(value: UnityEngine.Rendering.UVChannelFlags);
            public get spriteCount(): number;
            public get speedRange(): UnityEngine.Vector2;
            public set speedRange(value: UnityEngine.Vector2);
            public AddSprite ($sprite: UnityEngine.Sprite) : void
            public RemoveSprite ($index: number) : void
            public SetSprite ($index: number, $sprite: UnityEngine.Sprite) : void
            public GetSprite ($index: number) : UnityEngine.Sprite
        }
        class LightsModule extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            public get enabled(): boolean;
            public set enabled(value: boolean);
            public get ratio(): number;
            public set ratio(value: number);
            public get useRandomDistribution(): boolean;
            public set useRandomDistribution(value: boolean);
            public get light(): UnityEngine.Light;
            public set light(value: UnityEngine.Light);
            public get useParticleColor(): boolean;
            public set useParticleColor(value: boolean);
            public get sizeAffectsRange(): boolean;
            public set sizeAffectsRange(value: boolean);
            public get alphaAffectsIntensity(): boolean;
            public set alphaAffectsIntensity(value: boolean);
            public get range(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set range(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get rangeMultiplier(): number;
            public set rangeMultiplier(value: number);
            public get intensity(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set intensity(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get intensityMultiplier(): number;
            public set intensityMultiplier(value: number);
            public get maxLights(): number;
            public set maxLights(value: number);
        }
        class TrailModule extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            public get enabled(): boolean;
            public set enabled(value: boolean);
            public get mode(): UnityEngine.ParticleSystemTrailMode;
            public set mode(value: UnityEngine.ParticleSystemTrailMode);
            public get ratio(): number;
            public set ratio(value: number);
            public get lifetime(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set lifetime(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get lifetimeMultiplier(): number;
            public set lifetimeMultiplier(value: number);
            public get minVertexDistance(): number;
            public set minVertexDistance(value: number);
            public get textureMode(): UnityEngine.ParticleSystemTrailTextureMode;
            public set textureMode(value: UnityEngine.ParticleSystemTrailTextureMode);
            public get textureScale(): UnityEngine.Vector2;
            public set textureScale(value: UnityEngine.Vector2);
            public get worldSpace(): boolean;
            public set worldSpace(value: boolean);
            public get dieWithParticles(): boolean;
            public set dieWithParticles(value: boolean);
            public get sizeAffectsWidth(): boolean;
            public set sizeAffectsWidth(value: boolean);
            public get sizeAffectsLifetime(): boolean;
            public set sizeAffectsLifetime(value: boolean);
            public get inheritParticleColor(): boolean;
            public set inheritParticleColor(value: boolean);
            public get colorOverLifetime(): UnityEngine.ParticleSystem.MinMaxGradient;
            public set colorOverLifetime(value: UnityEngine.ParticleSystem.MinMaxGradient);
            public get widthOverTrail(): UnityEngine.ParticleSystem.MinMaxCurve;
            public set widthOverTrail(value: UnityEngine.ParticleSystem.MinMaxCurve);
            public get widthOverTrailMultiplier(): number;
            public set widthOverTrailMultiplier(value: number);
            public get colorOverTrail(): UnityEngine.ParticleSystem.MinMaxGradient;
            public set colorOverTrail(value: UnityEngine.ParticleSystem.MinMaxGradient);
            public get generateLightingData(): boolean;
            public set generateLightingData(value: boolean);
            public get ribbonCount(): number;
            public set ribbonCount(value: number);
            public get shadowBias(): number;
            public set shadowBias(value: number);
            public get splitSubEmitterRibbons(): boolean;
            public set splitSubEmitterRibbons(value: boolean);
            public get attachRibbonsToTransform(): boolean;
            public set attachRibbonsToTransform(value: boolean);
        }
        class CustomDataModule extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        class MinMaxCurve extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        class Burst extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        class MinMaxGradient extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace UnityEngine.EventSystems {
        class UIBehaviour extends UnityEngine.MonoBehaviour
        {
            protected [__keep_incompatibility]: never;
        }
        interface IEventSystemHandler
        {
        }
        interface IPointerEnterHandler extends UnityEngine.EventSystems.IEventSystemHandler
        {
        }
        interface ISelectHandler extends UnityEngine.EventSystems.IEventSystemHandler
        {
        }
        interface IPointerExitHandler extends UnityEngine.EventSystems.IEventSystemHandler
        {
        }
        interface IDeselectHandler extends UnityEngine.EventSystems.IEventSystemHandler
        {
        }
        interface IPointerDownHandler extends UnityEngine.EventSystems.IEventSystemHandler
        {
        }
        interface IPointerUpHandler extends UnityEngine.EventSystems.IEventSystemHandler
        {
        }
        interface IMoveHandler extends UnityEngine.EventSystems.IEventSystemHandler
        {
        }
        interface ISubmitHandler extends UnityEngine.EventSystems.IEventSystemHandler
        {
        }
        interface IPointerClickHandler extends UnityEngine.EventSystems.IEventSystemHandler
        {
        }
        interface ICancelHandler extends UnityEngine.EventSystems.IEventSystemHandler
        {
        }
        interface IBeginDragHandler extends UnityEngine.EventSystems.IEventSystemHandler
        {
        }
        interface IDragHandler extends UnityEngine.EventSystems.IEventSystemHandler
        {
        }
        interface IEndDragHandler extends UnityEngine.EventSystems.IEventSystemHandler
        {
        }
        interface IScrollHandler extends UnityEngine.EventSystems.IEventSystemHandler
        {
        }
        interface IUpdateSelectedHandler extends UnityEngine.EventSystems.IEventSystemHandler
        {
        }
        interface IInitializePotentialDragHandler extends UnityEngine.EventSystems.IEventSystemHandler
        {
        }
        class AbstractEventData extends System.Object
        {
            protected [__keep_incompatibility]: never;
        }
        class BaseEventData extends UnityEngine.EventSystems.AbstractEventData
        {
            protected [__keep_incompatibility]: never;
        }
        class PointerEventData extends UnityEngine.EventSystems.BaseEventData
        {
            protected [__keep_incompatibility]: never;
        }
        class AxisEventData extends UnityEngine.EventSystems.BaseEventData
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace UnityEngine.UI {
        class Graphic extends UnityEngine.EventSystems.UIBehaviour implements UnityEngine.UI.ICanvasElement
        {
            protected [__keep_incompatibility]: never;
        }
        interface ICanvasElement
        {
        }
        class MaskableGraphic extends UnityEngine.UI.Graphic implements UnityEngine.UI.IClippable, UnityEngine.UI.IMaterialModifier, UnityEngine.UI.IMaskable, UnityEngine.UI.ICanvasElement
        {
            protected [__keep_incompatibility]: never;
        }
        interface IClippable
        {
        }
        interface IMaterialModifier
        {
        }
        interface IMaskable
        {
        }
        class Selectable extends UnityEngine.EventSystems.UIBehaviour implements UnityEngine.EventSystems.IEventSystemHandler, UnityEngine.EventSystems.IPointerEnterHandler, UnityEngine.EventSystems.ISelectHandler, UnityEngine.EventSystems.IPointerExitHandler, UnityEngine.EventSystems.IDeselectHandler, UnityEngine.EventSystems.IPointerDownHandler, UnityEngine.EventSystems.IPointerUpHandler, UnityEngine.EventSystems.IMoveHandler
        {
            protected [__keep_incompatibility]: never;
        }
        interface ILayoutElement
        {
        }
        class Scrollbar extends UnityEngine.UI.Selectable implements UnityEngine.EventSystems.IBeginDragHandler, UnityEngine.EventSystems.IInitializePotentialDragHandler, UnityEngine.EventSystems.IDragHandler, UnityEngine.UI.ICanvasElement, UnityEngine.EventSystems.IEventSystemHandler, UnityEngine.EventSystems.IPointerEnterHandler, UnityEngine.EventSystems.ISelectHandler, UnityEngine.EventSystems.IPointerExitHandler, UnityEngine.EventSystems.IDeselectHandler, UnityEngine.EventSystems.IPointerDownHandler, UnityEngine.EventSystems.IPointerUpHandler, UnityEngine.EventSystems.IMoveHandler
        {
            protected [__keep_incompatibility]: never;
        }
        enum CanvasUpdate
        { Prelayout = 0, Layout = 1, PostLayout = 2, PreRender = 3, LatePreRender = 4, MaxUpdateValue = 5 }
        class Image extends UnityEngine.UI.MaskableGraphic implements UnityEngine.UI.IClippable, UnityEngine.UI.IMaterialModifier, UnityEngine.ICanvasRaycastFilter, UnityEngine.ISerializationCallbackReceiver, UnityEngine.UI.IMaskable, UnityEngine.UI.ICanvasElement, UnityEngine.UI.ILayoutElement
        {
            protected [__keep_incompatibility]: never;
        }
        class Button extends UnityEngine.UI.Selectable implements UnityEngine.EventSystems.ISubmitHandler, UnityEngine.EventSystems.IPointerClickHandler, UnityEngine.EventSystems.IEventSystemHandler, UnityEngine.EventSystems.IPointerEnterHandler, UnityEngine.EventSystems.ISelectHandler, UnityEngine.EventSystems.IPointerExitHandler, UnityEngine.EventSystems.IDeselectHandler, UnityEngine.EventSystems.IPointerDownHandler, UnityEngine.EventSystems.IPointerUpHandler, UnityEngine.EventSystems.IMoveHandler
        {
            protected [__keep_incompatibility]: never;
            public get onClick(): UnityEngine.UI.Button.ButtonClickedEvent;
            public set onClick(value: UnityEngine.UI.Button.ButtonClickedEvent);
            public OnPointerClick ($eventData: UnityEngine.EventSystems.PointerEventData) : void
            public OnSubmit ($eventData: UnityEngine.EventSystems.BaseEventData) : void
        }
        class Slider extends UnityEngine.UI.Selectable implements UnityEngine.EventSystems.IInitializePotentialDragHandler, UnityEngine.EventSystems.IDragHandler, UnityEngine.UI.ICanvasElement, UnityEngine.EventSystems.IEventSystemHandler, UnityEngine.EventSystems.IPointerEnterHandler, UnityEngine.EventSystems.ISelectHandler, UnityEngine.EventSystems.IPointerExitHandler, UnityEngine.EventSystems.IDeselectHandler, UnityEngine.EventSystems.IPointerDownHandler, UnityEngine.EventSystems.IPointerUpHandler, UnityEngine.EventSystems.IMoveHandler
        {
            protected [__keep_incompatibility]: never;
            public get fillRect(): UnityEngine.RectTransform;
            public set fillRect(value: UnityEngine.RectTransform);
            public get handleRect(): UnityEngine.RectTransform;
            public set handleRect(value: UnityEngine.RectTransform);
            public get direction(): UnityEngine.UI.Slider.Direction;
            public set direction(value: UnityEngine.UI.Slider.Direction);
            public get minValue(): number;
            public set minValue(value: number);
            public get maxValue(): number;
            public set maxValue(value: number);
            public get wholeNumbers(): boolean;
            public set wholeNumbers(value: boolean);
            public get value(): number;
            public set value(value: number);
            public get normalizedValue(): number;
            public set normalizedValue(value: number);
            public get onValueChanged(): UnityEngine.UI.Slider.SliderEvent;
            public set onValueChanged(value: UnityEngine.UI.Slider.SliderEvent);
            public SetValueWithoutNotify ($input: number) : void
            public Rebuild ($executing: UnityEngine.UI.CanvasUpdate) : void
            public LayoutComplete () : void
            public GraphicUpdateComplete () : void
            public OnDrag ($eventData: UnityEngine.EventSystems.PointerEventData) : void
            public OnInitializePotentialDrag ($eventData: UnityEngine.EventSystems.PointerEventData) : void
            public SetDirection ($direction: UnityEngine.UI.Slider.Direction, $includeRectLayouts: boolean) : void
        }
    }
    namespace TMPro {
        class TMP_Text extends UnityEngine.UI.MaskableGraphic implements UnityEngine.UI.IClippable, UnityEngine.UI.IMaterialModifier, UnityEngine.UI.IMaskable, UnityEngine.UI.ICanvasElement
        {
            protected [__keep_incompatibility]: never;
            public get text(): string;
            public set text(value: string);
            public get textPreprocessor(): TMPro.ITextPreprocessor;
            public set textPreprocessor(value: TMPro.ITextPreprocessor);
            public get isRightToLeftText(): boolean;
            public set isRightToLeftText(value: boolean);
            public get font(): TMPro.TMP_FontAsset;
            public set font(value: TMPro.TMP_FontAsset);
            public get fontSharedMaterial(): UnityEngine.Material;
            public set fontSharedMaterial(value: UnityEngine.Material);
            public get fontSharedMaterials(): System.Array$1<UnityEngine.Material>;
            public set fontSharedMaterials(value: System.Array$1<UnityEngine.Material>);
            public get fontMaterial(): UnityEngine.Material;
            public set fontMaterial(value: UnityEngine.Material);
            public get fontMaterials(): System.Array$1<UnityEngine.Material>;
            public set fontMaterials(value: System.Array$1<UnityEngine.Material>);
            public get color(): UnityEngine.Color;
            public set color(value: UnityEngine.Color);
            public get alpha(): number;
            public set alpha(value: number);
            public get enableVertexGradient(): boolean;
            public set enableVertexGradient(value: boolean);
            public get colorGradient(): TMPro.VertexGradient;
            public set colorGradient(value: TMPro.VertexGradient);
            public get colorGradientPreset(): TMPro.TMP_ColorGradient;
            public set colorGradientPreset(value: TMPro.TMP_ColorGradient);
            public get spriteAsset(): TMPro.TMP_SpriteAsset;
            public set spriteAsset(value: TMPro.TMP_SpriteAsset);
            public get tintAllSprites(): boolean;
            public set tintAllSprites(value: boolean);
            public get styleSheet(): TMPro.TMP_StyleSheet;
            public set styleSheet(value: TMPro.TMP_StyleSheet);
            public get textStyle(): TMPro.TMP_Style;
            public set textStyle(value: TMPro.TMP_Style);
            public get overrideColorTags(): boolean;
            public set overrideColorTags(value: boolean);
            public get faceColor(): UnityEngine.Color32;
            public set faceColor(value: UnityEngine.Color32);
            public get outlineColor(): UnityEngine.Color32;
            public set outlineColor(value: UnityEngine.Color32);
            public get outlineWidth(): number;
            public set outlineWidth(value: number);
            public get fontSize(): number;
            public set fontSize(value: number);
            public get fontWeight(): TMPro.FontWeight;
            public set fontWeight(value: TMPro.FontWeight);
            public get pixelsPerUnit(): number;
            public get enableAutoSizing(): boolean;
            public set enableAutoSizing(value: boolean);
            public get fontSizeMin(): number;
            public set fontSizeMin(value: number);
            public get fontSizeMax(): number;
            public set fontSizeMax(value: number);
            public get fontStyle(): TMPro.FontStyles;
            public set fontStyle(value: TMPro.FontStyles);
            public get isUsingBold(): boolean;
            public get horizontalAlignment(): TMPro.HorizontalAlignmentOptions;
            public set horizontalAlignment(value: TMPro.HorizontalAlignmentOptions);
            public get verticalAlignment(): TMPro.VerticalAlignmentOptions;
            public set verticalAlignment(value: TMPro.VerticalAlignmentOptions);
            public get alignment(): TMPro.TextAlignmentOptions;
            public set alignment(value: TMPro.TextAlignmentOptions);
            public get characterSpacing(): number;
            public set characterSpacing(value: number);
            public get wordSpacing(): number;
            public set wordSpacing(value: number);
            public get lineSpacing(): number;
            public set lineSpacing(value: number);
            public get lineSpacingAdjustment(): number;
            public set lineSpacingAdjustment(value: number);
            public get paragraphSpacing(): number;
            public set paragraphSpacing(value: number);
            public get characterWidthAdjustment(): number;
            public set characterWidthAdjustment(value: number);
            public get textWrappingMode(): TMPro.TextWrappingModes;
            public set textWrappingMode(value: TMPro.TextWrappingModes);
            public get wordWrappingRatios(): number;
            public set wordWrappingRatios(value: number);
            public get overflowMode(): TMPro.TextOverflowModes;
            public set overflowMode(value: TMPro.TextOverflowModes);
            public get isTextOverflowing(): boolean;
            public get firstOverflowCharacterIndex(): number;
            public get linkedTextComponent(): TMPro.TMP_Text;
            public set linkedTextComponent(value: TMPro.TMP_Text);
            public get isTextTruncated(): boolean;
            public get fontFeatures(): System.Collections.Generic.List$1<UnityEngine.TextCore.OTL_FeatureTag>;
            public set fontFeatures(value: System.Collections.Generic.List$1<UnityEngine.TextCore.OTL_FeatureTag>);
            public get extraPadding(): boolean;
            public set extraPadding(value: boolean);
            public get richText(): boolean;
            public set richText(value: boolean);
            public get emojiFallbackSupport(): boolean;
            public set emojiFallbackSupport(value: boolean);
            public get parseCtrlCharacters(): boolean;
            public set parseCtrlCharacters(value: boolean);
            public get isOverlay(): boolean;
            public set isOverlay(value: boolean);
            public get isOrthographic(): boolean;
            public set isOrthographic(value: boolean);
            public get enableCulling(): boolean;
            public set enableCulling(value: boolean);
            public get ignoreVisibility(): boolean;
            public set ignoreVisibility(value: boolean);
            public get horizontalMapping(): TMPro.TextureMappingOptions;
            public set horizontalMapping(value: TMPro.TextureMappingOptions);
            public get verticalMapping(): TMPro.TextureMappingOptions;
            public set verticalMapping(value: TMPro.TextureMappingOptions);
            public get mappingUvLineOffset(): number;
            public set mappingUvLineOffset(value: number);
            public get renderMode(): TMPro.TextRenderFlags;
            public set renderMode(value: TMPro.TextRenderFlags);
            public get geometrySortingOrder(): TMPro.VertexSortingOrder;
            public set geometrySortingOrder(value: TMPro.VertexSortingOrder);
            public get isTextObjectScaleStatic(): boolean;
            public set isTextObjectScaleStatic(value: boolean);
            public get vertexBufferAutoSizeReduction(): boolean;
            public set vertexBufferAutoSizeReduction(value: boolean);
            public get firstVisibleCharacter(): number;
            public set firstVisibleCharacter(value: number);
            public get maxVisibleCharacters(): number;
            public set maxVisibleCharacters(value: number);
            public get maxVisibleWords(): number;
            public set maxVisibleWords(value: number);
            public get maxVisibleLines(): number;
            public set maxVisibleLines(value: number);
            public get useMaxVisibleDescender(): boolean;
            public set useMaxVisibleDescender(value: boolean);
            public get pageToDisplay(): number;
            public set pageToDisplay(value: number);
            public get margin(): UnityEngine.Vector4;
            public set margin(value: UnityEngine.Vector4);
            public get textInfo(): TMPro.TMP_TextInfo;
            public get havePropertiesChanged(): boolean;
            public set havePropertiesChanged(value: boolean);
            public get isUsingLegacyAnimationComponent(): boolean;
            public set isUsingLegacyAnimationComponent(value: boolean);
            public get transform(): UnityEngine.Transform;
            public get rectTransform(): UnityEngine.RectTransform;
            public get autoSizeTextContainer(): boolean;
            public set autoSizeTextContainer(value: boolean);
            public get mesh(): UnityEngine.Mesh;
            public get isVolumetricText(): boolean;
            public set isVolumetricText(value: boolean);
            public get bounds(): UnityEngine.Bounds;
            public get textBounds(): UnityEngine.Bounds;
            public get flexibleHeight(): number;
            public get flexibleWidth(): number;
            public get minWidth(): number;
            public get minHeight(): number;
            public get maxWidth(): number;
            public get maxHeight(): number;
            public get preferredWidth(): number;
            public get preferredHeight(): number;
            public get renderedWidth(): number;
            public get renderedHeight(): number;
            public get layoutPriority(): number;
            public static add_OnFontAssetRequest ($value: System.Func$3<number, string, TMPro.TMP_FontAsset>) : void
            public static remove_OnFontAssetRequest ($value: System.Func$3<number, string, TMPro.TMP_FontAsset>) : void
            public static add_OnSpriteAssetRequest ($value: System.Func$3<number, string, TMPro.TMP_SpriteAsset>) : void
            public static remove_OnSpriteAssetRequest ($value: System.Func$3<number, string, TMPro.TMP_SpriteAsset>) : void
            public static add_OnMissingCharacter ($value: TMPro.TMP_Text.MissingCharacterEventCallback) : void
            public static remove_OnMissingCharacter ($value: TMPro.TMP_Text.MissingCharacterEventCallback) : void
            public add_OnPreRenderText ($value: System.Action$1<TMPro.TMP_TextInfo>) : void
            public remove_OnPreRenderText ($value: System.Action$1<TMPro.TMP_TextInfo>) : void
            public ForceMeshUpdate ($ignoreActiveState?: boolean, $forceTextReparsing?: boolean) : void
            public UpdateGeometry ($mesh: UnityEngine.Mesh, $index: number) : void
            public UpdateVertexData ($flags: TMPro.TMP_VertexDataUpdateFlags) : void
            public UpdateVertexData () : void
            public SetVertices ($vertices: System.Array$1<UnityEngine.Vector3>) : void
            public UpdateMeshPadding () : void
            public SetText ($sourceText: string) : void
            public SetText ($sourceText: string, $arg0: number) : void
            public SetText ($sourceText: string, $arg0: number, $arg1: number) : void
            public SetText ($sourceText: string, $arg0: number, $arg1: number, $arg2: number) : void
            public SetText ($sourceText: string, $arg0: number, $arg1: number, $arg2: number, $arg3: number) : void
            public SetText ($sourceText: string, $arg0: number, $arg1: number, $arg2: number, $arg3: number, $arg4: number) : void
            public SetText ($sourceText: string, $arg0: number, $arg1: number, $arg2: number, $arg3: number, $arg4: number, $arg5: number) : void
            public SetText ($sourceText: string, $arg0: number, $arg1: number, $arg2: number, $arg3: number, $arg4: number, $arg5: number, $arg6: number) : void
            public SetText ($sourceText: string, $arg0: number, $arg1: number, $arg2: number, $arg3: number, $arg4: number, $arg5: number, $arg6: number, $arg7: number) : void
            public SetText ($sourceText: System.Text.StringBuilder) : void
            public SetText ($sourceText: System.Array$1<number>) : void
            public SetText ($sourceText: System.Array$1<number>, $start: number, $length: number) : void
            public SetCharArray ($sourceText: System.Array$1<number>) : void
            public SetCharArray ($sourceText: System.Array$1<number>, $start: number, $length: number) : void
            public GetPreferredValues () : UnityEngine.Vector2
            public GetPreferredValues ($width: number, $height: number) : UnityEngine.Vector2
            public GetPreferredValues ($text: string) : UnityEngine.Vector2
            public GetPreferredValues ($text: string, $width: number, $height: number) : UnityEngine.Vector2
            public GetRenderedValues () : UnityEngine.Vector2
            public GetRenderedValues ($onlyVisibleCharacters: boolean) : UnityEngine.Vector2
            public GetTextInfo ($text: string) : TMPro.TMP_TextInfo
            public ComputeMarginSize () : void
            public ClearMesh () : void
            public ClearMesh ($uploadGeometry: boolean) : void
            public GetParsedText () : string
        }
        interface ITextPreprocessor
        {
        }
        class TMP_Asset extends UnityEngine.ScriptableObject
        {
            protected [__keep_incompatibility]: never;
        }
        class TMP_FontAsset extends TMPro.TMP_Asset
        {
            protected [__keep_incompatibility]: never;
        }
        class VertexGradient extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        class TMP_ColorGradient extends UnityEngine.ScriptableObject
        {
            protected [__keep_incompatibility]: never;
        }
        class TMP_SpriteAsset extends TMPro.TMP_Asset
        {
            protected [__keep_incompatibility]: never;
        }
        class TMP_StyleSheet extends UnityEngine.ScriptableObject
        {
            protected [__keep_incompatibility]: never;
        }
        class TMP_Style extends System.Object
        {
            protected [__keep_incompatibility]: never;
        }
        enum FontWeight
        { Thin = 100, ExtraLight = 200, Light = 300, Regular = 400, Medium = 500, SemiBold = 600, Bold = 700, Heavy = 800, Black = 900 }
        enum FontStyles
        { Normal = 0, Bold = 1, Italic = 2, Underline = 4, LowerCase = 8, UpperCase = 16, SmallCaps = 32, Strikethrough = 64, Superscript = 128, Subscript = 256, Highlight = 512 }
        enum HorizontalAlignmentOptions
        { Left = 1, Center = 2, Right = 4, Justified = 8, Flush = 16, Geometry = 32 }
        enum VerticalAlignmentOptions
        { Top = 256, Middle = 512, Bottom = 1024, Baseline = 2048, Geometry = 4096, Capline = 8192 }
        enum TextAlignmentOptions
        { TopLeft = 257, Top = 258, TopRight = 260, TopJustified = 264, TopFlush = 272, TopGeoAligned = 288, Left = 513, Center = 514, Right = 516, Justified = 520, Flush = 528, CenterGeoAligned = 544, BottomLeft = 1025, Bottom = 1026, BottomRight = 1028, BottomJustified = 1032, BottomFlush = 1040, BottomGeoAligned = 1056, BaselineLeft = 2049, Baseline = 2050, BaselineRight = 2052, BaselineJustified = 2056, BaselineFlush = 2064, BaselineGeoAligned = 2080, MidlineLeft = 4097, Midline = 4098, MidlineRight = 4100, MidlineJustified = 4104, MidlineFlush = 4112, MidlineGeoAligned = 4128, CaplineLeft = 8193, Capline = 8194, CaplineRight = 8196, CaplineJustified = 8200, CaplineFlush = 8208, CaplineGeoAligned = 8224, Converted = 65535 }
        enum TextWrappingModes
        { NoWrap = 0, Normal = 1, PreserveWhitespace = 2, PreserveWhitespaceNoWrap = 3 }
        enum TextOverflowModes
        { Overflow = 0, Ellipsis = 1, Masking = 2, Truncate = 3, ScrollRect = 4, Page = 5, Linked = 6 }
        enum TextureMappingOptions
        { Character = 0, Line = 1, Paragraph = 2, MatchAspect = 3 }
        enum TextRenderFlags
        { DontRender = 0, Render = 255 }
        enum VertexSortingOrder
        { Normal = 0, Reverse = 1 }
        class TMP_TextInfo extends System.Object
        {
            protected [__keep_incompatibility]: never;
        }
        enum TMP_VertexDataUpdateFlags
        { None = 0, Vertices = 1, Uv0 = 2, Uv2 = 4, Uv4 = 8, Colors32 = 16, All = 255 }
        class TMP_InputField extends UnityEngine.UI.Selectable implements UnityEngine.EventSystems.ISubmitHandler, UnityEngine.EventSystems.IPointerClickHandler, UnityEngine.EventSystems.ICancelHandler, UnityEngine.EventSystems.IBeginDragHandler, UnityEngine.EventSystems.IDragHandler, UnityEngine.EventSystems.IEndDragHandler, UnityEngine.UI.ICanvasElement, UnityEngine.EventSystems.IEventSystemHandler, UnityEngine.EventSystems.IScrollHandler, UnityEngine.EventSystems.IPointerEnterHandler, UnityEngine.EventSystems.IUpdateSelectedHandler, UnityEngine.EventSystems.ISelectHandler, UnityEngine.EventSystems.IPointerExitHandler, UnityEngine.EventSystems.IDeselectHandler, UnityEngine.EventSystems.IPointerDownHandler, UnityEngine.EventSystems.IPointerUpHandler, UnityEngine.EventSystems.IMoveHandler, UnityEngine.UI.ILayoutElement
        {
            protected [__keep_incompatibility]: never;
            public isAlert : boolean
            public get shouldActivateOnSelect(): boolean;
            public set shouldActivateOnSelect(value: boolean);
            public get shouldHideMobileInput(): boolean;
            public set shouldHideMobileInput(value: boolean);
            public get shouldHideSoftKeyboard(): boolean;
            public set shouldHideSoftKeyboard(value: boolean);
            public get text(): string;
            public set text(value: string);
            public get isFocused(): boolean;
            public get caretBlinkRate(): number;
            public set caretBlinkRate(value: number);
            public get caretWidth(): number;
            public set caretWidth(value: number);
            public get textViewport(): UnityEngine.RectTransform;
            public set textViewport(value: UnityEngine.RectTransform);
            public get textComponent(): TMPro.TMP_Text;
            public set textComponent(value: TMPro.TMP_Text);
            public get placeholder(): UnityEngine.UI.Graphic;
            public set placeholder(value: UnityEngine.UI.Graphic);
            public get verticalScrollbar(): UnityEngine.UI.Scrollbar;
            public set verticalScrollbar(value: UnityEngine.UI.Scrollbar);
            public get scrollSensitivity(): number;
            public set scrollSensitivity(value: number);
            public get caretColor(): UnityEngine.Color;
            public set caretColor(value: UnityEngine.Color);
            public get customCaretColor(): boolean;
            public set customCaretColor(value: boolean);
            public get selectionColor(): UnityEngine.Color;
            public set selectionColor(value: UnityEngine.Color);
            public get onEndEdit(): TMPro.TMP_InputField.SubmitEvent;
            public set onEndEdit(value: TMPro.TMP_InputField.SubmitEvent);
            public get onSubmit(): TMPro.TMP_InputField.SubmitEvent;
            public set onSubmit(value: TMPro.TMP_InputField.SubmitEvent);
            public get onSelect(): TMPro.TMP_InputField.SelectionEvent;
            public set onSelect(value: TMPro.TMP_InputField.SelectionEvent);
            public get onDeselect(): TMPro.TMP_InputField.SelectionEvent;
            public set onDeselect(value: TMPro.TMP_InputField.SelectionEvent);
            public get onTextSelection(): TMPro.TMP_InputField.TextSelectionEvent;
            public set onTextSelection(value: TMPro.TMP_InputField.TextSelectionEvent);
            public get onEndTextSelection(): TMPro.TMP_InputField.TextSelectionEvent;
            public set onEndTextSelection(value: TMPro.TMP_InputField.TextSelectionEvent);
            public get onValueChanged(): TMPro.TMP_InputField.OnChangeEvent;
            public set onValueChanged(value: TMPro.TMP_InputField.OnChangeEvent);
            public get onTouchScreenKeyboardStatusChanged(): TMPro.TMP_InputField.TouchScreenKeyboardEvent;
            public set onTouchScreenKeyboardStatusChanged(value: TMPro.TMP_InputField.TouchScreenKeyboardEvent);
            public get onValidateInput(): TMPro.TMP_InputField.OnValidateInput;
            public set onValidateInput(value: TMPro.TMP_InputField.OnValidateInput);
            public get characterLimit(): number;
            public set characterLimit(value: number);
            public get pointSize(): number;
            public set pointSize(value: number);
            public get fontAsset(): TMPro.TMP_FontAsset;
            public set fontAsset(value: TMPro.TMP_FontAsset);
            public get onFocusSelectAll(): boolean;
            public set onFocusSelectAll(value: boolean);
            public get resetOnDeActivation(): boolean;
            public set resetOnDeActivation(value: boolean);
            public get keepTextSelectionVisible(): boolean;
            public set keepTextSelectionVisible(value: boolean);
            public get restoreOriginalTextOnEscape(): boolean;
            public set restoreOriginalTextOnEscape(value: boolean);
            public get isRichTextEditingAllowed(): boolean;
            public set isRichTextEditingAllowed(value: boolean);
            public get contentType(): TMPro.TMP_InputField.ContentType;
            public set contentType(value: TMPro.TMP_InputField.ContentType);
            public get lineType(): TMPro.TMP_InputField.LineType;
            public set lineType(value: TMPro.TMP_InputField.LineType);
            public get lineLimit(): number;
            public set lineLimit(value: number);
            public get inputType(): TMPro.TMP_InputField.InputType;
            public set inputType(value: TMPro.TMP_InputField.InputType);
            public get touchScreenKeyboard(): UnityEngine.TouchScreenKeyboard;
            public get keyboardType(): UnityEngine.TouchScreenKeyboardType;
            public set keyboardType(value: UnityEngine.TouchScreenKeyboardType);
            public get characterValidation(): TMPro.TMP_InputField.CharacterValidation;
            public set characterValidation(value: TMPro.TMP_InputField.CharacterValidation);
            public get inputValidator(): TMPro.TMP_InputValidator;
            public set inputValidator(value: TMPro.TMP_InputValidator);
            public get readOnly(): boolean;
            public set readOnly(value: boolean);
            public get richText(): boolean;
            public set richText(value: boolean);
            public get multiLine(): boolean;
            public get asteriskChar(): number;
            public set asteriskChar(value: number);
            public get wasCanceled(): boolean;
            public get caretPosition(): number;
            public set caretPosition(value: number);
            public get selectionAnchorPosition(): number;
            public set selectionAnchorPosition(value: number);
            public get selectionFocusPosition(): number;
            public set selectionFocusPosition(value: number);
            public get stringPosition(): number;
            public set stringPosition(value: number);
            public get selectionStringAnchorPosition(): number;
            public set selectionStringAnchorPosition(value: number);
            public get selectionStringFocusPosition(): number;
            public set selectionStringFocusPosition(value: number);
            public get minWidth(): number;
            public get preferredWidth(): number;
            public get flexibleWidth(): number;
            public get minHeight(): number;
            public get preferredHeight(): number;
            public get flexibleHeight(): number;
            public get layoutPriority(): number;
            public SetTextWithoutNotify ($input: string) : void
            public MoveTextEnd ($shift: boolean) : void
            public MoveTextStart ($shift: boolean) : void
            public MoveToEndOfLine ($shift: boolean, $ctrl: boolean) : void
            public MoveToStartOfLine ($shift: boolean, $ctrl: boolean) : void
            public OnBeginDrag ($eventData: UnityEngine.EventSystems.PointerEventData) : void
            public OnDrag ($eventData: UnityEngine.EventSystems.PointerEventData) : void
            public OnEndDrag ($eventData: UnityEngine.EventSystems.PointerEventData) : void
            public ProcessEvent ($e: UnityEngine.Event) : void
            public OnUpdateSelected ($eventData: UnityEngine.EventSystems.BaseEventData) : void
            public OnScroll ($eventData: UnityEngine.EventSystems.PointerEventData) : void
            public ForceLabelUpdate () : void
            public Rebuild ($update: UnityEngine.UI.CanvasUpdate) : void
            public LayoutComplete () : void
            public GraphicUpdateComplete () : void
            public ActivateInputField () : void
            public OnPointerClick ($eventData: UnityEngine.EventSystems.PointerEventData) : void
            public OnControlClick () : void
            public ReleaseSelection () : void
            public DeactivateInputField ($clearSelection?: boolean) : void
            public OnSubmit ($eventData: UnityEngine.EventSystems.BaseEventData) : void
            public OnCancel ($eventData: UnityEngine.EventSystems.BaseEventData) : void
            public CalculateLayoutInputHorizontal () : void
            public CalculateLayoutInputVertical () : void
            public SetGlobalPointSize ($pointSize: number) : void
            public SetGlobalFontAsset ($fontAsset: TMPro.TMP_FontAsset) : void
        }
        class TMP_InputValidator extends UnityEngine.ScriptableObject
        {
            protected [__keep_incompatibility]: never;
        }
        class TMP_Dropdown extends UnityEngine.UI.Selectable implements UnityEngine.EventSystems.ISubmitHandler, UnityEngine.EventSystems.IPointerClickHandler, UnityEngine.EventSystems.ICancelHandler, UnityEngine.EventSystems.IEventSystemHandler, UnityEngine.EventSystems.IPointerEnterHandler, UnityEngine.EventSystems.ISelectHandler, UnityEngine.EventSystems.IPointerExitHandler, UnityEngine.EventSystems.IDeselectHandler, UnityEngine.EventSystems.IPointerDownHandler, UnityEngine.EventSystems.IPointerUpHandler, UnityEngine.EventSystems.IMoveHandler
        {
            protected [__keep_incompatibility]: never;
            public get template(): UnityEngine.RectTransform;
            public set template(value: UnityEngine.RectTransform);
            public get captionText(): TMPro.TMP_Text;
            public set captionText(value: TMPro.TMP_Text);
            public get captionImage(): UnityEngine.UI.Image;
            public set captionImage(value: UnityEngine.UI.Image);
            public get placeholder(): UnityEngine.UI.Graphic;
            public set placeholder(value: UnityEngine.UI.Graphic);
            public get itemText(): TMPro.TMP_Text;
            public set itemText(value: TMPro.TMP_Text);
            public get itemImage(): UnityEngine.UI.Image;
            public set itemImage(value: UnityEngine.UI.Image);
            public get options(): System.Collections.Generic.List$1<TMPro.TMP_Dropdown.OptionData>;
            public set options(value: System.Collections.Generic.List$1<TMPro.TMP_Dropdown.OptionData>);
            public get onValueChanged(): TMPro.TMP_Dropdown.DropdownEvent;
            public set onValueChanged(value: TMPro.TMP_Dropdown.DropdownEvent);
            public get alphaFadeSpeed(): number;
            public set alphaFadeSpeed(value: number);
            public get value(): number;
            public set value(value: number);
            public get IsExpanded(): boolean;
            public get MultiSelect(): boolean;
            public set MultiSelect(value: boolean);
            public SetValueWithoutNotify ($input: number) : void
            public RefreshShownValue () : void
            public AddOptions ($options: System.Collections.Generic.List$1<TMPro.TMP_Dropdown.OptionData>) : void
            public AddOptions ($options: System.Collections.Generic.List$1<string>) : void
            public AddOptions ($options: System.Collections.Generic.List$1<UnityEngine.Sprite>) : void
            public ClearOptions () : void
            public OnPointerClick ($eventData: UnityEngine.EventSystems.PointerEventData) : void
            public OnSubmit ($eventData: UnityEngine.EventSystems.BaseEventData) : void
            public OnCancel ($eventData: UnityEngine.EventSystems.BaseEventData) : void
            public Show () : void
            public Hide () : void
        }
    }
    namespace UnityEngine.TextCore {
        enum OTL_FeatureTag
        { kern = 1801810542, liga = 1818847073, mark = 1835102827, mkmk = 1835756907 }
    }
    namespace TMPro.TMP_Text {
        interface MissingCharacterEventCallback
        { 
        (unicode: number, stringIndex: number, text: string, fontAsset: TMPro.TMP_FontAsset, textComponent: TMPro.TMP_Text) : void; 
        Invoke?: (unicode: number, stringIndex: number, text: string, fontAsset: TMPro.TMP_FontAsset, textComponent: TMPro.TMP_Text) => void;
        }
        var MissingCharacterEventCallback: { new (func: (unicode: number, stringIndex: number, text: string, fontAsset: TMPro.TMP_FontAsset, textComponent: TMPro.TMP_Text) => void): MissingCharacterEventCallback; }
    }
    namespace System.Text {
        class StringBuilder extends System.Object implements System.Runtime.Serialization.ISerializable
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace TMPro.TMP_InputField {
        class SubmitEvent extends UnityEngine.Events.UnityEvent$1<string> implements UnityEngine.ISerializationCallbackReceiver
        {
            protected [__keep_incompatibility]: never;
        }
        class SelectionEvent extends UnityEngine.Events.UnityEvent$1<string> implements UnityEngine.ISerializationCallbackReceiver
        {
            protected [__keep_incompatibility]: never;
        }
        class TextSelectionEvent extends UnityEngine.Events.UnityEvent$3<string, number, number> implements UnityEngine.ISerializationCallbackReceiver
        {
            protected [__keep_incompatibility]: never;
        }
        class OnChangeEvent extends UnityEngine.Events.UnityEvent$1<string> implements UnityEngine.ISerializationCallbackReceiver
        {
            protected [__keep_incompatibility]: never;
        }
        class TouchScreenKeyboardEvent extends UnityEngine.Events.UnityEvent$1<UnityEngine.TouchScreenKeyboard.Status> implements UnityEngine.ISerializationCallbackReceiver
        {
            protected [__keep_incompatibility]: never;
        }
        interface OnValidateInput
        { 
        (text: string, charIndex: number, addedChar: number) : number; 
        Invoke?: (text: string, charIndex: number, addedChar: number) => number;
        }
        var OnValidateInput: { new (func: (text: string, charIndex: number, addedChar: number) => number): OnValidateInput; }
        enum ContentType
        { Standard = 0, Autocorrected = 1, IntegerNumber = 2, DecimalNumber = 3, Alphanumeric = 4, Name = 5, EmailAddress = 6, Password = 7, Pin = 8, Custom = 9 }
        enum LineType
        { SingleLine = 0, MultiLineSubmit = 1, MultiLineNewline = 2 }
        enum InputType
        { Standard = 0, AutoCorrect = 1, Password = 2 }
        enum CharacterValidation
        { None = 0, Digit = 1, Integer = 2, Decimal = 3, Alphanumeric = 4, Name = 5, Regex = 6, EmailAddress = 7, CustomValidator = 8 }
    }
    namespace UnityEngine.TouchScreenKeyboard {
        enum Status
        { Visible = 0, Done = 1, Canceled = 2, LostFocus = 3 }
    }
    namespace TMPro.TMP_Dropdown {
        class OptionData extends System.Object
        {
            protected [__keep_incompatibility]: never;
        }
        class DropdownEvent extends UnityEngine.Events.UnityEvent$1<number> implements UnityEngine.ISerializationCallbackReceiver
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace UnityEngine.UI.Button {
        class ButtonClickedEvent extends UnityEngine.Events.UnityEvent implements UnityEngine.ISerializationCallbackReceiver
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace UnityEngine.UI.Slider {
        enum Direction
        { LeftToRight = 0, RightToLeft = 1, BottomToTop = 2, TopToBottom = 3 }
        class SliderEvent extends UnityEngine.Events.UnityEvent$1<number> implements UnityEngine.ISerializationCallbackReceiver
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace Sonity.Internal {
        class SoundEventBase extends UnityEngine.ScriptableObject
        {
            protected [__keep_incompatibility]: never;
        }
        class SoundTagBase extends UnityEngine.ScriptableObject
        {
            protected [__keep_incompatibility]: never;
        }
        class SoundParameterInternals extends System.Object
        {
            protected [__keep_incompatibility]: never;
        }
        enum SpectrumDataFrom
        { LastPlayedAudioSource = 0 }
    }
    namespace Sonity {
        class SoundEvent extends Sonity.Internal.SoundEventBase
        {
            protected [__keep_incompatibility]: never;
            public Play ($owner: UnityEngine.Transform) : void
            public Play ($owner: UnityEngine.Transform, $localSoundTag: Sonity.Internal.SoundTagBase) : void
            public Play ($owner: UnityEngine.Transform, ...soundParameters: Sonity.Internal.SoundParameterInternals[]) : void
            public Play ($owner: UnityEngine.Transform, $localSoundTag: Sonity.Internal.SoundTagBase, ...soundParameters: Sonity.Internal.SoundParameterInternals[]) : void
            public PlayAtPosition ($owner: UnityEngine.Transform, $position: UnityEngine.Transform) : void
            public PlayAtPosition ($owner: UnityEngine.Transform, $position: UnityEngine.Transform, $localSoundTag: Sonity.Internal.SoundTagBase) : void
            public PlayAtPosition ($owner: UnityEngine.Transform, $position: UnityEngine.Transform, ...soundParameters: Sonity.Internal.SoundParameterInternals[]) : void
            public PlayAtPosition ($owner: UnityEngine.Transform, $position: UnityEngine.Transform, $localSoundTag: Sonity.Internal.SoundTagBase, ...soundParameters: Sonity.Internal.SoundParameterInternals[]) : void
            public PlayAtPosition ($owner: UnityEngine.Transform, $position: UnityEngine.Vector3) : void
            public PlayAtPosition ($owner: UnityEngine.Transform, $position: UnityEngine.Vector3, $localSoundTag: Sonity.Internal.SoundTagBase) : void
            public PlayAtPosition ($owner: UnityEngine.Transform, $position: UnityEngine.Vector3, ...soundParameters: Sonity.Internal.SoundParameterInternals[]) : void
            public PlayAtPosition ($owner: UnityEngine.Transform, $position: UnityEngine.Vector3, $localSoundTag: Sonity.Internal.SoundTagBase, ...soundParameters: Sonity.Internal.SoundParameterInternals[]) : void
            public Stop ($owner: UnityEngine.Transform, $allowFadeOut?: boolean) : void
            public StopAtPosition ($position: UnityEngine.Transform, $allowFadeOut?: boolean) : void
            public StopAllAtOwner ($owner: UnityEngine.Transform, $allowFadeOut?: boolean) : void
            public StopAllowFadeOut ($owner: UnityEngine.Transform) : void
            public StopAtPositionAllowFadeOut ($position: UnityEngine.Transform) : void
            public StopAllAtOwnerAllowFadeOut ($owner: UnityEngine.Transform) : void
            public StopImmediate ($owner: UnityEngine.Transform) : void
            public StopAtPositionImmediate ($position: UnityEngine.Transform) : void
            public StopAllAtOwnerImmediate ($owner: UnityEngine.Transform) : void
            public StopEverywhere ($allowFadeOut?: boolean) : void
            public StopEverything ($allowFadeOut?: boolean) : void
            public Pause ($owner: UnityEngine.Transform, $forcePause?: boolean) : void
            public Unpause ($owner: UnityEngine.Transform) : void
            public PauseAllAtOwner ($owner: UnityEngine.Transform, $forcePause?: boolean) : void
            public UnpauseAllAtOwner ($owner: UnityEngine.Transform) : void
            public PauseEverywhere ($forcePause?: boolean) : void
            public UnpauseEverywhere () : void
            public PauseEverything ($forcePause?: boolean) : void
            public UnpauseEverything () : void
            public Play2D () : void
            public Play2D ($localSoundTag: Sonity.Internal.SoundTagBase) : void
            public Play2D (...soundParameters: Sonity.Internal.SoundParameterInternals[]) : void
            public Play2D ($localSoundTag: Sonity.Internal.SoundTagBase, ...soundParameters: Sonity.Internal.SoundParameterInternals[]) : void
            public Play2DAtPosition ($position: UnityEngine.Vector3) : void
            public Play2DAtPosition ($position: UnityEngine.Transform) : void
            public Stop2D ($allowFadeOut?: boolean) : void
            public StopAll2D ($allowFadeOut?: boolean) : void
            public Pause2D ($forcePause?: boolean) : void
            public Unpause2D () : void
            public PauseAll2D ($forcePause?: boolean) : void
            public UnpauseAll2D () : void
            public Get2DSoundEventState () : Sonity.SoundEventState
            public Get2DLastPlayedClipLength ($pitchSpeed: boolean) : number
            public Get2DLastPlayedClipTimeSeconds ($pitchSpeed: boolean) : number
            public Get2DLastPlayedClipTimeRatio () : number
            public Get2DTimePlayed () : number
            public Get2DTransform () : UnityEngine.Transform
            public PlayMusic ($stopAllOtherMusic?: boolean, $allowFadeOut?: boolean) : void
            public PlayMusic ($stopAllOtherMusic?: boolean, $allowFadeOut?: boolean, ...soundParameters: Sonity.Internal.SoundParameterInternals[]) : void
            public PlayMusicAllowFadeOut ($stopAllOtherMusic?: boolean) : void
            public PlayMusicImmediate ($stopAllOtherMusic?: boolean) : void
            public StopMusic ($allowFadeOut?: boolean) : void
            public StopAllMusic ($allowFadeOut?: boolean) : void
            public PauseMusic ($forcePause?: boolean) : void
            public UnpauseMusic () : void
            public PauseAllMusic ($forcePause?: boolean) : void
            public UnpauseAllMusic () : void
            public GetMusicSoundEventState () : Sonity.SoundEventState
            public GetMusicLastPlayedClipLength ($pitchSpeed: boolean) : number
            public GetMusicLastPlayedClipTimeSeconds ($pitchSpeed: boolean) : number
            public GetMusicLastPlayedClipTimeRatio () : number
            public GetMusicTimePlayed () : number
            public GetMusicTransform () : UnityEngine.Transform
            public GetSoundEventState ($owner: UnityEngine.Transform) : Sonity.SoundEventState
            public GetLastPlayedClipLength ($owner: UnityEngine.Transform, $pitchSpeed: boolean) : number
            public GetLastPlayedClipTimeSeconds ($owner: UnityEngine.Transform, $pitchSpeed: boolean) : number
            public GetLastPlayedClipTimeRatio ($owner: UnityEngine.Transform) : number
            public GetSpectrumData ($owner: UnityEngine.Transform, $samples: $Ref<System.Array$1<number>>, $channel: number, $window: UnityEngine.FFTWindow, $spectrumDataFrom: Sonity.Internal.SpectrumDataFrom) : void
            public GetMaxLength () : number
            public GetTimePlayed ($owner: UnityEngine.Transform) : number
            public LoadAudioData () : void
            public UnloadAudioData () : void
            public constructor ()
        }
        enum SoundEventState
        { NotPlaying = 0, Delayed = 1, Playing = 2, Paused = 3 }
    }
    namespace VoxelPlayground.Mod {
        class ModAPI extends System.Object
        {
            protected [__keep_incompatibility]: never;
            public static get ControlledVehicle(): VoxelPlayground.Entity.IVehicle;
            public static get ControlledCharacter(): VoxelPlayground.Entity.EntityCharacter;
            public static get PlayerHealth(): number;
            public static set PlayerHealth(value: number);
            public static get PlayerMaxHealth(): number;
            public static get ShowHUD(): boolean;
            public static get OnSceneLoaded(): UnityEngine.Events.UnityEvent;
            public static set OnSceneLoaded(value: UnityEngine.Events.UnityEvent);
            public static get OnSceneUnloaded(): UnityEngine.Events.UnityEvent;
            public static set OnSceneUnloaded(value: UnityEngine.Events.UnityEvent);
            public static GetAllCharacters () : System.Array$1<VoxelPlayground.Entity.EntityCharacter>
            public static GetCharactersInRange ($center: UnityEngine.Vector3, $radius: number) : System.Array$1<VoxelPlayground.Entity.EntityCharacter>
            public static GetCharacterModel ($ch: VoxelPlayground.Entity.EntityCharacter) : UnityEngine.GameObject
            public static GetCharacterBody ($ch: VoxelPlayground.Entity.EntityCharacter, $bodyName: string) : Px5.Unity.PxRigidBody
            public static AttachJointToCharacter ($ch: VoxelPlayground.Entity.EntityCharacter, $connectedBody: Px5.Unity.PxRigidBody, $bodyName?: string) : Px5.Unity.PxD6Joint
            public static CharacterContainsRigidbody ($ch: VoxelPlayground.Entity.EntityCharacter, $rb: Px5.Unity.PxRigidBody) : boolean
            public static IsCharacterCarryingRigidbody ($ch: VoxelPlayground.Entity.EntityCharacter, $rb: Px5.Unity.PxRigidBody) : boolean
            public static GetCharacterCarriedRigidbody ($ch: VoxelPlayground.Entity.EntityCharacter, $isLeftHand: boolean) : Px5.Unity.PxRigidBody
            public static IsCharacterGrounded ($ch: VoxelPlayground.Entity.EntityCharacter) : boolean
            public static SetCharacterHanging ($ch: VoxelPlayground.Entity.EntityCharacter, $hanging: boolean) : void
            public static GetCharacterVelocity ($ch: VoxelPlayground.Entity.EntityCharacter) : UnityEngine.Vector3
            public static SetCharacterVelocity ($ch: VoxelPlayground.Entity.EntityCharacter, $v: UnityEngine.Vector3) : void
            public static AddCharacterVelocity ($ch: VoxelPlayground.Entity.EntityCharacter, $v: UnityEngine.Vector3, $mode?: UnityEngine.ForceMode) : void
            public static AddCharacterMotion ($ch: VoxelPlayground.Entity.EntityCharacter, $v: UnityEngine.Vector3, $mode?: UnityEngine.ForceMode) : void
            public static TeleportCharacter ($ch: VoxelPlayground.Entity.EntityCharacter, $pos: UnityEngine.Vector3, $rot: UnityEngine.Quaternion) : void
            public static GetCharacterCurrentState ($ch: VoxelPlayground.Entity.EntityCharacter) : VoxelPlayground.Utility.State
            public static SetCharacterCurrentState ($ch: VoxelPlayground.Entity.EntityCharacter, $stateName: string) : void
            public static AddCharacterStateChangedListener ($ch: VoxelPlayground.Entity.EntityCharacter, $cb: UnityEngine.Events.UnityAction$1<VoxelPlayground.Utility.State>) : void
            public static RemoveCharacterStateChangedListener ($ch: VoxelPlayground.Entity.EntityCharacter, $cb: UnityEngine.Events.UnityAction$1<VoxelPlayground.Utility.State>) : void
            public static AddCharacterAIActionChangedListener ($ch: VoxelPlayground.Entity.EntityCharacter, $cb: UnityEngine.Events.UnityAction$1<VoxelPlayground.AI.AIAction>) : void
            public static RemoveCharacterAIActionChangedListener ($ch: VoxelPlayground.Entity.EntityCharacter, $cb: UnityEngine.Events.UnityAction$1<VoxelPlayground.AI.AIAction>) : void
            public static GetXRControllerTransform ($isLeft: boolean) : UnityEngine.Transform
            public static VibrateXRController ($isLeft: boolean, $amplitude?: number, $duration?: number, $frequency?: number) : void
            public static GetMainCamera () : UnityEngine.Camera
            public static AddCharacterSpawnedListener ($cb: UnityEngine.Events.UnityAction$1<VoxelPlayground.Entity.EntityCharacter>) : void
            public static RemoveCharacterSpawnedListener ($cb: UnityEngine.Events.UnityAction$1<VoxelPlayground.Entity.EntityCharacter>) : void
            public static SpawnItem ($itemKey: string, $pos: UnityEngine.Vector3, $rot: UnityEngine.Quaternion) : UnityEngine.GameObject
            public static PlaySoundAt ($soundKey: string, $pos: UnityEngine.Vector3, $mixerType?: VoxelPlayground.Sound.SoundManager.SoundMixerType) : void
            public static PlayBulletHitSound ($materialId: number, $hitPoint: UnityEngine.Vector3, $volume?: number) : void
            public static PlaySoundOnTransform ($soundEvent: Sonity.SoundEvent, $target: UnityEngine.Transform, $mixerType?: VoxelPlayground.Sound.SoundManager.SoundMixerType) : void
            public static PlaySoundAtPosition ($soundEvent: Sonity.SoundEvent, $emitter: UnityEngine.Transform, $pos: UnityEngine.Vector3, $mixerType?: VoxelPlayground.Sound.SoundManager.SoundMixerType) : void
            public static StopSoundOnTransform ($soundEvent: Sonity.SoundEvent, $target: UnityEngine.Transform) : void
            public static IsSoundPlaying ($soundEvent: Sonity.SoundEvent, $target: UnityEngine.Transform) : boolean
            public static PushBgm ($soundEvent: Sonity.SoundEvent, $priority?: VoxelPlayground.Sound.BgmPriority) : void
            public static PopBgm ($soundEvent: Sonity.SoundEvent, $priority?: VoxelPlayground.Sound.BgmPriority) : void
            public static PlayVFX ($effectKey: string, $pos: UnityEngine.Vector3, $scale?: number) : UnityEngine.GameObject
            public static GetCurrentVersion () : VoxelPlayground.Mod.SemanticVersion
            public static Log ($message: string) : void
            public static GetEntityMainRigidbody ($e: VoxelPlayground.Entity.Entity) : Px5.Unity.PxRigidBody
            public static GetEntityRigidbodies ($e: VoxelPlayground.Entity.Entity) : System.Array$1<Px5.Unity.PxRigidBody>
            public static GetConnectedEntities ($e: VoxelPlayground.Entity.Entity) : System.Array$1<VoxelPlayground.Entity.Entity>
            public static SetEntityPinned ($e: VoxelPlayground.Entity.Entity, $pinned: boolean) : void
            public static SetEntityGravityEnabled ($e: VoxelPlayground.Entity.Entity, $enabled: boolean) : void
            public static SetEntityActivated ($e: VoxelPlayground.Entity.Entity, $active: boolean) : void
            public static IsEntityActivated ($e: VoxelPlayground.Entity.Entity) : boolean
            public static SetEntityVisible ($e: VoxelPlayground.Entity.Entity, $visible: boolean) : void
            public static SetEntityHighlight ($e: VoxelPlayground.Entity.Entity, $highlighted: boolean) : void
            public static TeleportEntity ($e: VoxelPlayground.Entity.Entity, $pos: UnityEngine.Vector3, $rot: UnityEngine.Quaternion) : void
            public static AddWeaponTriggerPressedListener ($w: VoxelPlayground.Entity.EntityFirableWeapon, $cb: System.Action) : void
            public static RemoveWeaponTriggerPressedListener ($w: VoxelPlayground.Entity.EntityFirableWeapon, $cb: System.Action) : void
            public static AddWeaponTriggerReleasedListener ($w: VoxelPlayground.Entity.EntityFirableWeapon, $cb: System.Action) : void
            public static RemoveWeaponTriggerReleasedListener ($w: VoxelPlayground.Entity.EntityFirableWeapon, $cb: System.Action) : void
            public static AddWeaponFiredListener ($w: VoxelPlayground.Entity.EntityHoldWeapon, $cb: System.Action) : void
            public static RemoveWeaponFiredListener ($w: VoxelPlayground.Entity.EntityHoldWeapon, $cb: System.Action) : void
            public static SetWeaponTriggerPressed ($w: VoxelPlayground.Entity.EntityFirableWeapon, $pressed: boolean) : void
            public static GetWeaponReloadFraction ($w: VoxelPlayground.Entity.EntityFirableWeapon) : number
            public static HasWeaponAmmo ($w: VoxelPlayground.Entity.EntityFirableWeapon) : boolean
            public static GetWeaponAmmo ($w: VoxelPlayground.Entity.EntityFirableWeapon) : number
            public static GetWeaponAmmoCapacity ($w: VoxelPlayground.Entity.EntityFirableWeapon) : number
            public static GetVehicleTransform ($vehicle: VoxelPlayground.Entity.IVehicle) : UnityEngine.Transform
            public static GetVehicleCenterOfMass ($vehicle: VoxelPlayground.Entity.IVehicle) : UnityEngine.Transform
            public static GetVehicleDoorHandle ($vehicle: VoxelPlayground.Entity.IVehicle) : UnityEngine.Transform
            public static IsVehicleExploded ($vehicle: VoxelPlayground.Entity.IVehicle) : boolean
            public static CanVehicleRotateYaw ($vehicle: VoxelPlayground.Entity.IVehicle) : boolean
            public static SetVehicleEngineEnabled ($vehicle: VoxelPlayground.Entity.IVehicle, $enabled: boolean) : void
            public static ApplyVehicleThrottle ($vehicle: VoxelPlayground.Entity.IVehicle, $throttle: number) : void
            public static ApplyVehicleBrake ($vehicle: VoxelPlayground.Entity.IVehicle, $brake: number) : void
            public static ApplyVehicleSteering ($vehicle: VoxelPlayground.Entity.IVehicle, $steering: UnityEngine.Vector4) : void
            public static TriggerVehicleAbility ($vehicle: VoxelPlayground.Entity.IVehicle) : void
            public static IsVehicleProxy ($vehicle: VoxelPlayground.Entity.IVehicle) : boolean
            public static ClearVehicleProxyCallbacks ($vehicle: VoxelPlayground.Entity.IVehicle) : void
            public static SetVehicleProxyExplodedGetter ($vehicle: VoxelPlayground.Entity.IVehicle, $cb: System.Func$1<boolean>) : void
            public static SetVehicleProxyCanRotateYawGetter ($vehicle: VoxelPlayground.Entity.IVehicle, $cb: System.Func$1<boolean>) : void
            public static SetVehicleProxyEngineEnabledHandler ($vehicle: VoxelPlayground.Entity.IVehicle, $cb: System.Action$1<boolean>) : void
            public static SetVehicleProxyThrottleHandler ($vehicle: VoxelPlayground.Entity.IVehicle, $cb: System.Action$1<number>) : void
            public static SetVehicleProxyBrakeHandler ($vehicle: VoxelPlayground.Entity.IVehicle, $cb: System.Action$1<number>) : void
            public static SetVehicleProxySteeringHandler ($vehicle: VoxelPlayground.Entity.IVehicle, $cb: System.Action$1<UnityEngine.Vector4>) : void
            public static SetVehicleProxyAbilityPressedHandler ($vehicle: VoxelPlayground.Entity.IVehicle, $cb: System.Action) : void
            public static DemolishVoxelSphere ($voxel: VoxelPlayground.Destruction.VoxelDestructor, $center: UnityEngine.Vector3, $radius: number, $force?: number, $explodeDirection?: UnityEngine.Vector3, $spreadAngle?: number, $maxFragments?: number, $hardnessCap?: number) : void
            public static ClearVoxelScreenLine ($voxel: VoxelPlayground.Destruction.VoxelDestructor, $screenA: UnityEngine.Vector2, $screenB: UnityEngine.Vector2, $worldToScreen: UnityEngine.Matrix4x4, $chunk: VoxelPlayground.Engine.VoxelChunk) : void
            public static ExplodeVoxelObject ($voxel: VoxelPlayground.Destruction.VoxelDestructor, $specialEffect?: boolean, $randomRemoval?: boolean) : void
            public static ModifyVoxelProperty ($voxel: VoxelPlayground.Destruction.VoxelDestructor, $center: UnityEngine.Vector3, $radius: number, $property?: VoxelPlayground.Engine.PointDataV2.Property) : void
            public static ProjectVoxelDecal ($voxel: VoxelPlayground.Destruction.VoxelDestructor, $center: UnityEngine.Vector3, $radius: number, $decalTexture: UnityEngine.Texture2D, $projectDirection: UnityEngine.Vector3, $projectDepth: number, $splatType?: VoxelPlayground.Engine.Destruction.SplatType, $opacity?: number) : void
            public static GetVoxelSolidCount ($voxel: VoxelPlayground.Engine.VoxelVolume) : number
            public static GetVoxelOriginalSolidCount ($voxel: VoxelPlayground.Engine.VoxelVolume) : number
            public static GetVoxelSolidRatio ($voxel: VoxelPlayground.Engine.VoxelVolume) : number
            public static AddVoxelModifiedListener ($voxel: VoxelPlayground.Engine.VoxelVolume, $cb: System.Action$1<VoxelPlayground.Engine.VoxelVolume>) : void
            public static RemoveVoxelModifiedListener ($voxel: VoxelPlayground.Engine.VoxelVolume, $cb: System.Action$1<VoxelPlayground.Engine.VoxelVolume>) : void
            public static AddVoxelFragmentedListener ($voxel: VoxelPlayground.Destruction.VoxelDestructor, $cb: System.Action) : void
            public static RemoveVoxelFragmentedListener ($voxel: VoxelPlayground.Destruction.VoxelDestructor, $cb: System.Action) : void
            public static IsVoxelDestructible ($voxel: VoxelPlayground.Destruction.VoxelDestructor) : boolean
            public static SetVoxelDestructible ($voxel: VoxelPlayground.Destruction.VoxelDestructor, $destructible: boolean) : void
            public static IsVoxelUnyielding ($voxel: VoxelPlayground.Destruction.VoxelDestructor) : boolean
            public static SetVoxelUnyielding ($voxel: VoxelPlayground.Destruction.VoxelDestructor, $unyielding: boolean) : void
            public static SetVoxelFortified ($voxel: VoxelPlayground.Destruction.VoxelDestructor, $fortified: boolean) : void
            public static ClearVoxelCylinder ($voxel: VoxelPlayground.Destruction.VoxelDestructor, $end1: UnityEngine.Vector3, $end2: UnityEngine.Vector3, $radius: number) : void
            public static ClearVoxelBoxSweep ($voxel: VoxelPlayground.Destruction.VoxelDestructor, $end1: UnityEngine.Vector3, $end2: UnityEngine.Vector3, $halfBox: UnityEngine.Vector3, $boxLocalToWorld: UnityEngine.Matrix4x4, $chunk: VoxelPlayground.Engine.VoxelChunk, $hardnessCap?: number) : void
            public static RestoreVoxelColor ($voxel: VoxelPlayground.Destruction.VoxelDestructor) : void
            public static GetVoxelAtWorld ($voxel: VoxelPlayground.Engine.VoxelVolume, $worldPos: UnityEngine.Vector3) : VoxelPlayground.Engine.PointDataV2
            public static GetVoxelAtLocal ($voxel: VoxelPlayground.Engine.VoxelVolume, $localPos: UnityEngine.Vector3Int) : VoxelPlayground.Engine.PointDataV2
            public static GetVoxelAtHit ($hit: Px5.UnityExtensions.RaycastHit) : VoxelPlayground.Engine.PointDataV2
            public static GetCharacterFaceRenderTarget ($ch: VoxelPlayground.Entity.EntityCharacter) : VoxelPlayground.Engine.VoxelVolume
            public static SetVoxelFaceProperties ($target: VoxelPlayground.Engine.VoxelVolume, $material: UnityEngine.Material, $animationEnable: boolean, $direction: number, $depth: number) : void
            public static IsVoxelCollider ($collider: Px5.Unity.PxCollider) : boolean
        }
        class SemanticVersion extends System.ValueType implements System.IComparable$1<VoxelPlayground.Mod.SemanticVersion>, System.IEquatable$1<VoxelPlayground.Mod.SemanticVersion>
        {
            protected [__keep_incompatibility]: never;
            public major : number
            public minor : number
            public patch : number
            public static Parse ($version: string) : VoxelPlayground.Mod.SemanticVersion
            public static TryParse ($version: string, $parsed: $Ref<VoxelPlayground.Mod.SemanticVersion>) : boolean
            public CompareTo ($other: VoxelPlayground.Mod.SemanticVersion) : number
            public Equals ($other: VoxelPlayground.Mod.SemanticVersion) : boolean
            public Equals ($obj: any) : boolean
            public static op_Equality ($left: VoxelPlayground.Mod.SemanticVersion, $right: VoxelPlayground.Mod.SemanticVersion) : boolean
            public static op_Inequality ($left: VoxelPlayground.Mod.SemanticVersion, $right: VoxelPlayground.Mod.SemanticVersion) : boolean
            public static op_LessThan ($left: VoxelPlayground.Mod.SemanticVersion, $right: VoxelPlayground.Mod.SemanticVersion) : boolean
            public static op_LessThanOrEqual ($left: VoxelPlayground.Mod.SemanticVersion, $right: VoxelPlayground.Mod.SemanticVersion) : boolean
            public static op_GreaterThan ($left: VoxelPlayground.Mod.SemanticVersion, $right: VoxelPlayground.Mod.SemanticVersion) : boolean
            public static op_GreaterThanOrEqual ($left: VoxelPlayground.Mod.SemanticVersion, $right: VoxelPlayground.Mod.SemanticVersion) : boolean
        }
        class JsComponentProxy extends UnityEngine.MonoBehaviour
        {
            protected [__keep_incompatibility]: never;
            public modId : string
            public className : string
            public onStart : System.Action
            public onUpdate : System.Action$1<number>
            public onFixedUpdate : System.Action$1<number>
            public onDestroy : System.Action
            public onEnable : System.Action
            public onDisable : System.Action
            public onCollisionEnter : System.Action$1<Px5.UnityExtensions.Collision>
            public onCollisionExit : System.Action$1<Px5.UnityExtensions.Collision>
            public onTriggerEnter : System.Action$1<Px5.Unity.PxCollider>
            public onTriggerExit : System.Action$1<Px5.Unity.PxCollider>
            public get ScriptInstance(): any;
            public InitializeJsBinding () : void
            public GetScript ($targetClassName: string) : any
            public GetScriptInChildren ($targetClassName: string, $includeInactive?: boolean) : any
            public GetScriptInParent ($targetClassName: string, $includeInactive?: boolean) : any
            public BindScriptInstance ($instance: any) : void
            public RefreshAfterJsReload () : void
            public PrepareForJsEnvDispose () : void
            public SoftReset () : void
            public PrepareForScriptHotReload () : void
            public CompleteScriptHotReload ($instance: any) : void
            public constructor ()
        }
        class JsProperties extends UnityEngine.MonoBehaviour
        {
            protected [__keep_incompatibility]: never;
            public get Pairs(): System.Array$1<VoxelPlayground.Mod.JsProperties.ResultPair>;
            public InvalidatePairsCache () : void
            public Copy ($other: VoxelPlayground.Mod.JsProperties) : void
            public Get ($key: string) : any
            public GenPairs () : System.Array$1<VoxelPlayground.Mod.JsProperties.ResultPair>
            public constructor ()
        }
    }
    namespace Px5.Unity {
        class PxComponent extends UnityEngine.MonoBehaviour implements Px5.Unity.IPxDependency
        {
            protected [__keep_incompatibility]: never;
        }
        interface IPxDependency
        {
        }
        class PxActor extends Px5.Unity.PxComponent implements Px5.Unity.IPxDependency
        {
            protected [__keep_incompatibility]: never;
        }
        class PxRigidBody extends Px5.Unity.PxActor implements Px5.Unity.IPxDependency
        {
            protected [__keep_incompatibility]: never;
            public get valid(): boolean;
            public get useGravity(): boolean;
            public set useGravity(value: boolean);
            public get mass(): number;
            public set mass(value: number);
            public get isKinematic(): boolean;
            public set isKinematic(value: boolean);
            public get velocity(): UnityEngine.Vector3;
            public set velocity(value: UnityEngine.Vector3);
            public get linearVelocity(): UnityEngine.Vector3;
            public set linearVelocity(value: UnityEngine.Vector3);
            public get angularVelocity(): UnityEngine.Vector3;
            public set angularVelocity(value: UnityEngine.Vector3);
            public get maxLinearVelocity(): number;
            public set maxLinearVelocity(value: number);
            public get maxAngularVelocity(): number;
            public set maxAngularVelocity(value: number);
            public get solverIterations(): number;
            public set solverIterations(value: number);
            public get solverVelocityIterations(): number;
            public set solverVelocityIterations(value: number);
            public get drag(): number;
            public set drag(value: number);
            public get angularDrag(): number;
            public set angularDrag(value: number);
            public get centerOfMass(): UnityEngine.Vector3;
            public set centerOfMass(value: UnityEngine.Vector3);
            public get worldCenterOfMass(): UnityEngine.Vector3;
            public get inertiaTensor(): UnityEngine.Vector3;
            public set inertiaTensor(value: UnityEngine.Vector3);
            public get inertiaTensorRotation(): UnityEngine.Quaternion;
            public set inertiaTensorRotation(value: UnityEngine.Quaternion);
            public get position(): UnityEngine.Vector3;
            public set position(value: UnityEngine.Vector3);
            public get rotation(): UnityEngine.Quaternion;
            public set rotation(value: UnityEngine.Quaternion);
            public get automaticCenterOfMass(): boolean;
            public set automaticCenterOfMass(value: boolean);
            public get automaticInertiaTensor(): boolean;
            public set automaticInertiaTensor(value: boolean);
            public get sleepThreshold(): number;
            public set sleepThreshold(value: number);
            public get constraints(): UnityEngine.RigidbodyConstraints;
            public set constraints(value: UnityEngine.RigidbodyConstraints);
            public get interpolation(): UnityEngine.RigidbodyInterpolation;
            public set interpolation(value: UnityEngine.RigidbodyInterpolation);
            public get maxContactImpulse(): number;
            public set maxContactImpulse(value: number);
            public get maxDepenetrationVelocity(): number;
            public set maxDepenetrationVelocity(value: number);
            public get collisionDetectionMode(): UnityEngine.CollisionDetectionMode;
            public set collisionDetectionMode(value: UnityEngine.CollisionDetectionMode);
            public get detectCollisions(): boolean;
            public set detectCollisions(value: boolean);
            public get indestructible(): boolean;
            public set indestructible(value: boolean);
            public get materialSupportGraph(): boolean;
            public set materialSupportGraph(value: boolean);
            public AddForce ($force: UnityEngine.Vector3, $mode?: UnityEngine.ForceMode) : void
            public AddForceAtPosition ($force: UnityEngine.Vector3, $position: UnityEngine.Vector3, $mode?: UnityEngine.ForceMode) : void
            public AddTorque ($torque: UnityEngine.Vector3, $mode?: UnityEngine.ForceMode) : void
            public MovePosition ($position: UnityEngine.Vector3) : void
            public MoveRotation ($rotation: UnityEngine.Quaternion) : void
            public MovePose ($position: UnityEngine.Vector3, $rotation: UnityEngine.Quaternion) : void
            public IsSleeping () : boolean
            public WakeUp () : void
            public WorldBound () : UnityEngine.Bounds
            public UpdateMassAndInertia () : void
            public ClosestPoint ($query: UnityEngine.Vector3) : UnityEngine.Vector3
            public ClosestCollider ($query: UnityEngine.Vector3) : Px5.Unity.PxCollider
            public setMassAndUpdateInertia () : void
            public Colliders () : System.Collections.Generic.IEnumerable$1<Px5.Unity.PxCollider>
            public DebugParam () : void
            public debugAddVelocity ($force: UnityEngine.Vector3, $mode: UnityEngine.ForceMode) : void
            public constructor ()
        }
        interface PxRigidBody {
            AddExplosionForce ($explosionForce: number, $explosionPosition: UnityEngine.Vector3, $explosionRadius: number, $upliftModifier: number, $forceMode?: UnityEngine.ForceMode) : void;
        }
        class PxJoint extends Px5.Unity.PxComponent implements Px5.Unity.IPxDependency
        {
            protected [__keep_incompatibility]: never;
            public onJointBreak : Px5.Unity.OnJointBreak
            public get apiJoint(): Px5.PxJoint;
            public get actor0(): Px5.Unity.PxActor;
            public set actor0(value: Px5.Unity.PxActor);
            public get actor1(): Px5.Unity.PxActor;
            public set actor1(value: Px5.Unity.PxActor);
            public get valid(): boolean;
            public get breakForce(): number;
            public set breakForce(value: number);
            public get breakTorque(): number;
            public set breakTorque(value: number);
            public get enableCollision(): boolean;
            public set enableCollision(value: boolean);
            public get connectedBody(): Px5.Unity.PxRigidBody;
            public set connectedBody(value: Px5.Unity.PxRigidBody);
            public get connectedMassScale(): number;
            public set connectedMassScale(value: number);
            public get autoConfigureConnectedAnchor(): boolean;
            public set autoConfigureConnectedAnchor(value: boolean);
            public get swapBodies(): boolean;
            public set swapBodies(value: boolean);
            public get currentForce(): UnityEngine.Vector3;
            public get currentTorque(): UnityEngine.Vector3;
            public get connectedAnchor(): UnityEngine.Vector3;
            public set connectedAnchor(value: UnityEngine.Vector3);
            public get anchor(): UnityEngine.Vector3;
            public set anchor(value: UnityEngine.Vector3);
            public get axis(): UnityEngine.Vector3;
            public set axis(value: UnityEngine.Vector3);
            public get secondaryAxis(): UnityEngine.Vector3;
            public set secondaryAxis(value: UnityEngine.Vector3);
            public get massScale(): number;
            public set massScale(value: number);
            public get enablePreprocessing(): boolean;
            public set enablePreprocessing(value: boolean);
            public SetJointAnchors ($position0: UnityEngine.Vector3, $computeAnchor1: boolean) : void
            public DebugParam () : void
            public constructor ()
        }
        class PxD6Joint extends Px5.Unity.PxJoint implements Px5.Unity.IPxDependency
        {
            protected [__keep_incompatibility]: never;
            public get valid(): boolean;
            public get apiJoint(): Px5.PxJoint;
            public get apiD6Joint(): Px5.PxD6Joint;
            public get xMotion(): UnityEngine.ConfigurableJointMotion;
            public set xMotion(value: UnityEngine.ConfigurableJointMotion);
            public get yMotion(): UnityEngine.ConfigurableJointMotion;
            public set yMotion(value: UnityEngine.ConfigurableJointMotion);
            public get zMotion(): UnityEngine.ConfigurableJointMotion;
            public set zMotion(value: UnityEngine.ConfigurableJointMotion);
            public get angularXMotion(): UnityEngine.ConfigurableJointMotion;
            public set angularXMotion(value: UnityEngine.ConfigurableJointMotion);
            public get angularYMotion(): UnityEngine.ConfigurableJointMotion;
            public set angularYMotion(value: UnityEngine.ConfigurableJointMotion);
            public get angularZMotion(): UnityEngine.ConfigurableJointMotion;
            public set angularZMotion(value: UnityEngine.ConfigurableJointMotion);
            public get linearLimit(): UnityEngine.SoftJointLimit;
            public set linearLimit(value: UnityEngine.SoftJointLimit);
            public get xDrive(): UnityEngine.JointDrive;
            public set xDrive(value: UnityEngine.JointDrive);
            public get yDrive(): UnityEngine.JointDrive;
            public set yDrive(value: UnityEngine.JointDrive);
            public get zDrive(): UnityEngine.JointDrive;
            public set zDrive(value: UnityEngine.JointDrive);
            public get targetPosition(): UnityEngine.Vector3;
            public set targetPosition(value: UnityEngine.Vector3);
            public get targetRotation(): UnityEngine.Quaternion;
            public set targetRotation(value: UnityEngine.Quaternion);
            public get targetVelocity(): UnityEngine.Vector3;
            public set targetVelocity(value: UnityEngine.Vector3);
            public get targetAngularVelocity(): UnityEngine.Vector3;
            public set targetAngularVelocity(value: UnityEngine.Vector3);
            public get slerpDrive(): UnityEngine.JointDrive;
            public set slerpDrive(value: UnityEngine.JointDrive);
            public get angularXDrive(): UnityEngine.JointDrive;
            public set angularXDrive(value: UnityEngine.JointDrive);
            public get angularYZDrive(): UnityEngine.JointDrive;
            public set angularYZDrive(value: UnityEngine.JointDrive);
            public get angularYLimit(): UnityEngine.SoftJointLimit;
            public set angularYLimit(value: UnityEngine.SoftJointLimit);
            public get angularZLimit(): UnityEngine.SoftJointLimit;
            public set angularZLimit(value: UnityEngine.SoftJointLimit);
            public get angularYZLimitSpring(): UnityEngine.SoftJointLimitSpring;
            public set angularYZLimitSpring(value: UnityEngine.SoftJointLimitSpring);
            public get configuredInWorldSpace(): boolean;
            public set configuredInWorldSpace(value: boolean);
            public get rotationDriveMode(): UnityEngine.RotationDriveMode;
            public set rotationDriveMode(value: UnityEngine.RotationDriveMode);
            public get projectionMode(): UnityEngine.JointProjectionMode;
            public set projectionMode(value: UnityEngine.JointProjectionMode);
            public get projectionAngle(): number;
            public set projectionAngle(value: number);
            public get projectionDistance(): number;
            public set projectionDistance(value: number);
            public get linearLimitSpring(): UnityEngine.SoftJointLimitSpring;
            public set linearLimitSpring(value: UnityEngine.SoftJointLimitSpring);
            public get highAngularXLimit(): UnityEngine.SoftJointLimit;
            public set highAngularXLimit(value: UnityEngine.SoftJointLimit);
            public get lowAngularXLimit(): UnityEngine.SoftJointLimit;
            public set lowAngularXLimit(value: UnityEngine.SoftJointLimit);
            public get angularXLimitSpring(): UnityEngine.SoftJointLimitSpring;
            public set angularXLimitSpring(value: UnityEngine.SoftJointLimitSpring);
            public UpdateAxis ($axis: UnityEngine.Vector3, $secondaryAxis: UnityEngine.Vector3) : void
            public static GetGizmoSize ($position: UnityEngine.Vector3) : number
            public DebugLog () : void
            public constructor ()
        }
        class PxCollider extends Px5.Unity.PxComponent implements Px5.Unity.IPxDependency
        {
            protected [__keep_incompatibility]: never;
            public apiShape : Px5.PxShape
            public get attachedRigidbody(): Px5.Unity.PxRigidBody;
            public get bounds(): UnityEngine.Bounds;
            public get isTrigger(): boolean;
            public set isTrigger(value: boolean);
            public get material(): Px5.Unity.PxMaterial;
            public set material(value: Px5.Unity.PxMaterial);
            public get includeLayers(): UnityEngine.LayerMask;
            public set includeLayers(value: UnityEngine.LayerMask);
            public get excludeLayers(): UnityEngine.LayerMask;
            public set excludeLayers(value: UnityEngine.LayerMask);
            public get layerOverridePriority(): number;
            public set layerOverridePriority(value: number);
            public get hasModifiableContacts(): boolean;
            public set hasModifiableContacts(value: boolean);
            public get hardness(): number;
            public set hardness(value: number);
            public ClosestPoint ($point: UnityEngine.Vector3) : UnityEngine.Vector3
            public UpdateLayer ($targetLayer?: number) : void
            public Raycast ($ray: UnityEngine.Ray, $hitInfo: $Ref<Px5.UnityExtensions.RaycastHit>, $maxDistance?: number) : boolean
            public UpdatePose () : void
            public GetLocalBounds () : UnityEngine.Bounds
            public DebugParam () : void
            public constructor ()
        }
        class PxPhysics extends System.Object
        {
            protected [__keep_incompatibility]: never;
            public static apiScene : Px5.PxScene
            public static get apiFoundation(): Px5.PxFoundation;
            public static get valid(): boolean;
            public static get apiPhysics(): Px5.PxPhysics;
            public static get cpuDispatcher(): Px5.PxCpuDispatcher;
            public static get noMaterial(): Px5.PxMaterial;
            public static get settings(): Px5.Unity.PxSettings;
            public static get gravity(): UnityEngine.Vector3;
            public static set gravity(value: UnityEngine.Vector3);
            public static get Scene(): Px5.Unity.PxScene;
            public static Raycast ($ray: UnityEngine.Ray, $hitInfo: $Ref<Px5.UnityExtensions.RaycastHit>, $maxDistance?: number, $layerMask?: number, $trigger?: UnityEngine.QueryTriggerInteraction) : boolean
            public static Raycast ($origin: UnityEngine.Vector3, $direction: UnityEngine.Vector3, $maxDistance?: number, $layerMask?: number, $trigger?: UnityEngine.QueryTriggerInteraction) : boolean
            public static Raycast ($origin: UnityEngine.Vector3, $direction: UnityEngine.Vector3, $hitInfo: $Ref<Px5.UnityExtensions.RaycastHit>, $maxDistance?: number, $layerMask?: number, $trigger?: UnityEngine.QueryTriggerInteraction) : boolean
            public static RaycastAll ($ray: UnityEngine.Ray, $maxDistance?: number, $layerMask?: number, $queryTriggerInteraction?: UnityEngine.QueryTriggerInteraction) : System.Array$1<Px5.UnityExtensions.RaycastHit>
            public static RaycastAll ($origin: UnityEngine.Vector3, $direction: UnityEngine.Vector3, $maxDistance?: number, $layerMask?: number, $queryTriggerInteraction?: UnityEngine.QueryTriggerInteraction) : System.Array$1<Px5.UnityExtensions.RaycastHit>
            public static RaycastNonAlloc ($origin: UnityEngine.Vector3, $direction: UnityEngine.Vector3, $hitResult: System.Array$1<Px5.UnityExtensions.RaycastHit>, $maxDistance?: number, $layerMask?: number, $queryTriggerInteraction?: UnityEngine.QueryTriggerInteraction) : number
            public static Linecast ($start: UnityEngine.Vector3, $end: UnityEngine.Vector3, $layerMask?: number, $queryTriggerInteraction?: UnityEngine.QueryTriggerInteraction) : boolean
            public static Linecast ($start: UnityEngine.Vector3, $end: UnityEngine.Vector3, $hitInfo: $Ref<Px5.UnityExtensions.RaycastHit>, $layerMask?: number, $queryTriggerInteraction?: UnityEngine.QueryTriggerInteraction) : boolean
            public static SphereCast ($origin: UnityEngine.Vector3, $radius: number, $direction: UnityEngine.Vector3, $hitInfo: $Ref<Px5.UnityExtensions.RaycastHit>, $maxDistance: number, $layerMask?: number, $trigger?: UnityEngine.QueryTriggerInteraction) : boolean
            public static SphereCastAll ($ray: UnityEngine.Ray, $radius: number, $maxDistance: number, $layerMask?: number, $trigger?: UnityEngine.QueryTriggerInteraction) : System.Array$1<Px5.UnityExtensions.RaycastHit>
            public static SphereCastAll ($origin: UnityEngine.Vector3, $radius: number, $direction: UnityEngine.Vector3, $maxDistance: number, $layerMask?: number, $queryTriggerInteraction?: UnityEngine.QueryTriggerInteraction) : System.Array$1<Px5.UnityExtensions.RaycastHit>
            public static SphereCastNonAlloc ($origin: UnityEngine.Vector3, $radius: number, $direction: UnityEngine.Vector3, $hitResult: System.Array$1<Px5.UnityExtensions.RaycastHit>, $maxDistance?: number, $layerMask?: number, $queryTriggerInteraction?: UnityEngine.QueryTriggerInteraction) : number
            public static OverlapBoxNonAlloc ($center: UnityEngine.Vector3, $halfExtent: UnityEngine.Vector3, $colliders: System.Array$1<Px5.Unity.PxCollider>, $rotation: UnityEngine.Quaternion, $layerMask?: number, $queryTriggerInteraction?: UnityEngine.QueryTriggerInteraction) : number
            public static OverlapSphereNonAlloc ($position: UnityEngine.Vector3, $radius: number, $colliders: System.Array$1<Px5.Unity.PxCollider>, $layerMask?: number, $queryTriggerInteraction?: UnityEngine.QueryTriggerInteraction) : number
            public static OverlapSphere ($position: UnityEngine.Vector3, $radius: number, $layerMask?: number, $queryTriggerInteraction?: UnityEngine.QueryTriggerInteraction) : System.Array$1<Px5.Unity.PxCollider>
            public static OverlapBox ($position: UnityEngine.Vector3, $halfExtent: UnityEngine.Vector3, $orientation: UnityEngine.Quaternion, $layerMask?: number, $queryTriggerInteraction?: UnityEngine.QueryTriggerInteraction) : System.Array$1<Px5.Unity.PxCollider>
            public static CapsuleCast ($point1: UnityEngine.Vector3, $point2: UnityEngine.Vector3, $radius: number, $direction: UnityEngine.Vector3, $maxDistance: number, $layerMask?: number, $trigger?: UnityEngine.QueryTriggerInteraction) : boolean
            public static CapsuleCastAll ($point1: UnityEngine.Vector3, $point2: UnityEngine.Vector3, $radius: number, $direction: UnityEngine.Vector3, $maxDistance: number, $layerMask?: number, $queryTriggerInteraction?: UnityEngine.QueryTriggerInteraction) : System.Array$1<Px5.UnityExtensions.RaycastHit>
            public static CapsuleCastNonAlloc ($point1: UnityEngine.Vector3, $point2: UnityEngine.Vector3, $radius: number, $direction: UnityEngine.Vector3, $hitResult: System.Array$1<Px5.UnityExtensions.RaycastHit>, $maxDistance: number, $layerMask?: number, $queryTriggerInteraction?: UnityEngine.QueryTriggerInteraction) : number
            public static IgnoreCollision ($col1: Px5.Unity.PxCollider, $col2: Px5.Unity.PxCollider, $ignore?: boolean) : void
            public static isCollisionIgnored ($col1: Px5.Unity.PxCollider, $col2: Px5.Unity.PxCollider) : boolean
            public static ClosestPoint ($point: UnityEngine.Vector3, $collider: Px5.Unity.PxCollider, $position: UnityEngine.Vector3, $rotation: UnityEngine.Quaternion) : UnityEngine.Vector3
            public static AddExplosionForce ($body: Px5.Unity.PxRigidBody, $explosionForce: number, $explosionPosition: UnityEngine.Vector3, $explosionRadius: number, $upliftModifier: number, $forceMode?: UnityEngine.ForceMode) : void
            public static GetShapeQueryFilterData ($layerMask: number, $isTrigger: boolean) : Px5.PxFilterData
            public static GetQueryFilterData ($layerMask: number, $includeTrigger: boolean) : Px5.PxFilterData
            public static GetSimulationFilterData ($layer: number, $overridePriority: number, $includeLayers: UnityEngine.LayerMask, $excludeLayers: UnityEngine.LayerMask) : Px5.PxFilterData
        }
        class PxAsset extends UnityEngine.ScriptableObject implements Px5.Unity.IPxDependency
        {
            protected [__keep_incompatibility]: never;
        }
        class PxSettings extends Px5.Unity.PxAsset implements Px5.Unity.IPxDependency
        {
            protected [__keep_incompatibility]: never;
        }
        class PxScene extends Px5.Unity.PxComponent implements Px5.Unity.IPxDependency
        {
            protected [__keep_incompatibility]: never;
        }
        class PxMaterial extends Px5.Unity.PxAsset implements Px5.Unity.IPxDependency
        {
            protected [__keep_incompatibility]: never;
        }
        class PxBoxCollider extends Px5.Unity.PxCollider implements Px5.Unity.IPxDependency
        {
            protected [__keep_incompatibility]: never;
            public get size(): UnityEngine.Vector3;
            public set size(value: UnityEngine.Vector3);
            public get center(): UnityEngine.Vector3;
            public set center(value: UnityEngine.Vector3);
            public OnDrawGizmosSelected () : void
            public constructor ()
        }
        class PxSphereCollider extends Px5.Unity.PxCollider implements Px5.Unity.IPxDependency
        {
            protected [__keep_incompatibility]: never;
            public get radius(): number;
            public set radius(value: number);
            public get center(): UnityEngine.Vector3;
            public set center(value: UnityEngine.Vector3);
            public OnDrawGizmosSelected () : void
            public constructor ()
        }
        class PxCapsuleCollider extends Px5.Unity.PxCollider implements Px5.Unity.IPxDependency
        {
            protected [__keep_incompatibility]: never;
            public get height(): number;
            public set height(value: number);
            public get radius(): number;
            public set radius(value: number);
            public get center(): UnityEngine.Vector3;
            public set center(value: UnityEngine.Vector3);
            public get direction(): number;
            public set direction(value: number);
            public OnDrawGizmosSelected () : void
            public constructor ()
        }
        class PxMeshCollider extends Px5.Unity.PxCollider implements Px5.Unity.IPxDependency
        {
            protected [__keep_incompatibility]: never;
            public get mesh(): UnityEngine.Mesh;
            public set mesh(value: UnityEngine.Mesh);
            public get convex(): boolean;
            public set convex(value: boolean);
            public get cookingOptions(): UnityEngine.MeshColliderCookingOptions;
            public set cookingOptions(value: UnityEngine.MeshColliderCookingOptions);
            public OnDrawGizmosSelected () : void
            public constructor ()
        }
        interface OnJointBreak
        { 
        (force: number) : void; 
        Invoke?: (force: number) => void;
        }
        var OnJointBreak: { new (func: (force: number) => void): OnJointBreak; }
        class PxFixedJoint extends Px5.Unity.PxJoint implements Px5.Unity.IPxDependency
        {
            protected [__keep_incompatibility]: never;
            public get valid(): boolean;
            public get apiJoint(): Px5.PxJoint;
            public constructor ()
        }
        class PxHingeJoint extends Px5.Unity.PxJoint implements Px5.Unity.IPxDependency
        {
            protected [__keep_incompatibility]: never;
            public get apiJoint(): Px5.PxJoint;
            public get useSpring(): boolean;
            public set useSpring(value: boolean);
            public get useLimits(): boolean;
            public set useLimits(value: boolean);
            public get useMotor(): boolean;
            public set useMotor(value: boolean);
            public get spring(): UnityEngine.JointSpring;
            public set spring(value: UnityEngine.JointSpring);
            public get limits(): UnityEngine.JointLimits;
            public set limits(value: UnityEngine.JointLimits);
            public get motor(): UnityEngine.JointMotor;
            public set motor(value: UnityEngine.JointMotor);
            public get extendedLimits(): boolean;
            public set extendedLimits(value: boolean);
            public get useAcceleration(): boolean;
            public set useAcceleration(value: boolean);
            public get projectionMode(): UnityEngine.JointProjectionMode;
            public set projectionMode(value: UnityEngine.JointProjectionMode);
            public get projectionAngle(): number;
            public set projectionAngle(value: number);
            public get projectionDistance(): number;
            public set projectionDistance(value: number);
            public constructor ()
        }
    }
    namespace VoxelPlayground.Sound.SoundManager {
        enum SoundMixerType
        { Master = 0, SFX = 1, UI = 2, Music = 3 }
    }
    namespace VoxelPlayground.Sound {
        enum BgmPriority
        { MainMenu = 0, Level = 1, LevelCustom = 2, TutorialSilent = 5, HostileRankStart = 10, HostileRandEnd = 100, VictoryOrDefeated = 1000 }
    }
    namespace VoxelPlayground.Destruction {
        class VoxelDestructor extends UnityEngine.MonoBehaviour implements VoxelPlayground.Engine.IVoxelDestructible
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace VoxelPlayground.Engine.PointDataV2 {
        enum Property
        { Dummy = -1, Temperature = 5, BurningDuration = 8, PoisonLevel = 11, PoisonDuration = 14, Water = 17, Hardness = 32 }
    }
    namespace VoxelPlayground.Engine.Destruction {
        enum SplatType
        { Blood = 0, Acid = 1, Fire = 2, ColorOnly = 3 }
    }
    namespace Px5.UnityExtensions {
        class RaycastHit extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            public collider : Px5.Unity.PxCollider
            public normal : UnityEngine.Vector3
            public distance : number
            public point : UnityEngine.Vector3
            public transform : UnityEngine.Transform
            public rigidbody : Px5.Unity.PxRigidBody
        }
        class Collision extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            public contactCount : number
            public rigidbody : Px5.Unity.PxRigidBody
            public relativeVelocity : UnityEngine.Vector3
            public impulse : UnityEngine.Vector3
            public gameObject : UnityEngine.GameObject
            public transform : UnityEngine.Transform
            public contacts : System.Array$1<Px5.UnityExtensions.ContactPoint>
            public collider : Px5.Unity.PxCollider
            public ContactPose : UnityEngine.Matrix4x4
            public collisionType : Px5.UnityExtensions.CollisionType
            public GetContact ($index: number) : Px5.UnityExtensions.ContactPoint
            public GetContacts ($contacts: System.Array$1<Px5.UnityExtensions.ContactPoint>) : number
            public GetContacts ($contacts: System.Collections.Generic.List$1<Px5.UnityExtensions.ContactPoint>) : number
        }
        class ContactPoint extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            public static NoMaterialId : number
            public thisCollider : Px5.Unity.PxCollider
            public otherCollider : Px5.Unity.PxCollider
            public point : UnityEngine.Vector3
            public normal : UnityEngine.Vector3
            public impulse : UnityEngine.Vector3
            public seperation : number
            public thisMaterialId : number
            public otherMaterialId : number
            public TryGetThisMaterialId ($materialId: $Ref<number>) : boolean
            public TryGetOtherMaterialId ($materialId: $Ref<number>) : boolean
        }
        enum CollisionType
        { SurfaceHit = 0, PenetrateSelf = 1, PenetrateOthers = 2 }
    }
    namespace VoxelPlayground.Mod.ModAPI {
        class Input extends System.Object implements System.IDisposable
        {
            protected [__keep_incompatibility]: never;
            public GetMoveInput () : UnityEngine.Vector2
            public GetLookInput () : UnityEngine.Vector2
            public GetAbilityLInput () : number
            public GetAbilityRInput () : number
            public GetJumpInput () : number
            public GetGripRInput () : number
            public GetGripLInput () : number
            public GetFireRInput () : number
            public GetFireLInput () : number
            public GetSprintInput () : number
            public GetWeaponAxisLInput () : number
            public GetWeaponAxisRInput () : number
            public GetVehiclePrimaryControl () : UnityEngine.Vector2
            public GetVehicleSecondaryControl () : UnityEngine.Vector2
            public Dispose () : void
            public constructor ()
        }
    }
    namespace VoxelPlayground.Mod.JsProperties {
        class ResultPair extends System.Object
        {
            protected [__keep_incompatibility]: never;
            public key : string
            public value : any
            public constructor ($pair: VoxelPlayground.Mod.JsProperties.IPair)
        }
        interface IPair
        {
        }
    }
    namespace Px5 {
        class PxScene extends System.Object
        {
            protected [__keep_incompatibility]: never;
        }
        class PxFoundation extends System.Object
        {
            protected [__keep_incompatibility]: never;
        }
        class PxPhysics extends System.Object
        {
            protected [__keep_incompatibility]: never;
        }
        class PxCpuDispatcher extends System.Object
        {
            protected [__keep_incompatibility]: never;
        }
        class PxBase extends System.Object
        {
            protected [__keep_incompatibility]: never;
        }
        class PxMaterial extends Px5.PxBase
        {
            protected [__keep_incompatibility]: never;
        }
        class PxFilterData extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        class PxShape extends Px5.PxBase
        {
            protected [__keep_incompatibility]: never;
        }
        class PxJoint extends Px5.PxBase
        {
            protected [__keep_incompatibility]: never;
        }
        class PxD6Joint extends Px5.PxJoint
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace Unity.Mathematics {
        class float3 extends System.ValueType implements System.IFormattable, System.IEquatable$1<Unity.Mathematics.float3>
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace System.Security {
        interface IEvidenceFactory
        {
        }
    }
    namespace System.Globalization {
        class CultureInfo extends System.Object implements System.ICloneable, System.IFormatProvider
        {
            protected [__keep_incompatibility]: never;
        }
    }
}
