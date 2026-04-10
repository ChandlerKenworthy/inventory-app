use serde::{Deserialize};
use serde_json::{Map, Value};
use axum::{extract::State, Json, http::StatusCode};
use std::sync::Arc;
use sqlx::{Column, Row, TypeInfo, ValueRef};
use crate::state::AppState;

#[derive(Deserialize)]
pub struct QueryPayload {
    query: String,
}

pub async fn run_custom_query(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<QueryPayload>, // Extracts { "query": "..." }
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {    
    // Execute the query
    let rows = sqlx::query(&payload.query)
        .fetch_all(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let mut results = Vec::new();

    for row in rows {
        let mut map = Map::new();
    
        for column in row.columns() {
            let name = column.name();
            let raw_value = row.try_get_raw(name)
                .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

            // 1. Fix: Bind the type_info to a variable so it lives through the match
            let info = raw_value.type_info();
            let type_name = info.name();

            let value = if raw_value.is_null() {
                Value::Null
            } else {
                match type_name {
                    "INTEGER" | "INT" | "INT64" | "TINYINT" | "SMALLINT" | "BIGINT" => {
                        let val: i64 = row.try_get(name).unwrap_or(0);
                        Value::Number(val.into())
                    }
                    "REAL" | "FLOAT" | "DOUBLE" | "NUMERIC" => {
                        let val: f64 = row.try_get(name).unwrap_or(0.0);
                        serde_json::Number::from_f64(val)
                            .map(Value::Number)
                            .unwrap_or(Value::Null)
                    }
                    "BOOLEAN" | "BOOL" => {
                        let val: bool = row.try_get(name).unwrap_or(false);
                        Value::Bool(val)
                    }
                    // Text and everything else treated as strings
                    _ => {
                        let val: String = row.try_get(name).unwrap_or_default();
                        Value::String(val)
                    }
                }
            };

            map.insert(name.to_string(), value);
        }
        results.push(Value::Object(map));
    }

    Ok(Json(Value::Array(results)))
}