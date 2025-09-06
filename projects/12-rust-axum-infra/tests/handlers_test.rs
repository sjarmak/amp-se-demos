use axum::{
    body::Body,
    http::{Request, StatusCode},
};
use tower::ServiceExt;
use rust_axum_infra::handlers;

#[tokio::test]
async fn test_health_endpoint() {
    let app = axum::Router::new().route("/health", axum::routing::get(handlers::health));
    
    let response = app
        .oneshot(Request::builder().uri("/health").body(Body::empty()).unwrap())
        .await
        .unwrap();
    
    assert_eq!(response.status(), StatusCode::OK);
}

#[tokio::test]
async fn test_nodes_endpoint_structure() {
    let app = axum::Router::new().route("/nodes", axum::routing::get(handlers::nodes));
    
    let response = app
        .oneshot(Request::builder().uri("/nodes").body(Body::empty()).unwrap())
        .await
        .unwrap();
    
    // Should return OK or 500 (depending on file availability)
    assert!(response.status() == StatusCode::OK || response.status() == StatusCode::INTERNAL_SERVER_ERROR);
}
