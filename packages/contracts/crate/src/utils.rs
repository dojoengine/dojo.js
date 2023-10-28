use dojo_types::primitive::Primitive;
use dojo_types::schema::Ty;
use serde_json::Value;

/// Serialize a [`Ty`] with a value as a JSON.
pub fn ty_with_value_as_json(ty: Ty) -> Value {
    match ty {
        Ty::Primitive(primitive) => primitive_value_json(primitive),

        Ty::Struct(struct_ty) => struct_ty
            .children
            .into_iter()
            .map(|child| (child.name, ty_with_value_as_json(child.ty)))
            .collect::<serde_json::Map<String, Value>>()
            .into(),

        Ty::Enum(enum_ty) => {
            if let Some(option) = enum_ty.option {
                let option = &enum_ty.options[option as usize];
                Value::String(option.name.to_owned())
            } else {
                Value::Null
            }
        }

        Ty::Tuple(_) => unimplemented!("tuple not supported"),
    }
}

fn primitive_value_json(primitive: Primitive) -> Value {
    match primitive {
        Primitive::Bool(Some(value)) => Value::Bool(value),
        Primitive::U8(Some(value)) => Value::Number(value.into()),
        Primitive::U16(Some(value)) => Value::Number(value.into()),
        Primitive::U32(Some(value)) => Value::Number(value.into()),
        Primitive::U64(Some(value)) => Value::Number(value.into()),
        Primitive::USize(Some(value)) => Value::Number(value.into()),
        Primitive::U128(Some(value)) => Value::String(format!("{value:#x}")),
        Primitive::U256(Some(value)) => Value::String(format!("{value:#x}")),
        Primitive::Felt252(Some(value)) => Value::String(format!("{value:#x}")),
        Primitive::ClassHash(Some(value)) => Value::String(format!("{value:#x}")),
        Primitive::ContractAddress(Some(value)) => Value::String(format!("{value:#x}")),
        _ => Value::Null,
    }
}
