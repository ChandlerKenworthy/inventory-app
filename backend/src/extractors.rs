use axum::{
    extract::{FromRequest, Request},
    http::StatusCode,
    Json,
    response::{IntoResponse, Response},
};
use serde::de::DeserializeOwned;
use validator::Validate;

pub struct ValidatedJson<T>(pub T);

impl<S, T> FromRequest<S> for ValidatedJson<T>
where
    S: Send + Sync,
    T: DeserializeOwned + Validate,
{
    type Rejection = Response;

    async fn from_request(req: Request, state: &S) -> Result<Self, Self::Rejection> {
        // 1. Extract the JSON
        // We use the Json::<T> extractor internally
        let Json(value) = Json::<T>::from_request(req, state)
            .await
            .map_err(|rejection| rejection.into_response())?;

        // 2. Validate the data
        value.validate().map_err(|errors| {
            // Return 422 for validation errors
            (StatusCode::UNPROCESSABLE_ENTITY, format!("Validation failed: {}", errors)).into_response()
        })?;

        Ok(ValidatedJson(value))
    }
}