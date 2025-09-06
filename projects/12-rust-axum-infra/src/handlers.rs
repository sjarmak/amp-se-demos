use axum::{response::Json, http::StatusCode};
use std::time::{SystemTime, UNIX_EPOCH};
use crate::models::{HealthResponse, Node};

pub async fn health() -> Result<Json<HealthResponse>, StatusCode> {
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .as_secs();
    
    Ok(Json(HealthResponse {
        status: "ok".to_string(),
        timestamp,
    }))
}

pub async fn nodes() -> Result<Json<Vec<Node>>, StatusCode> {
    // Intentional: basic CSV loading with room for optimization and caching
    let data = load_nodes_from_csv().await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    
    Ok(Json(data))
}

async fn load_nodes_from_csv() -> anyhow::Result<Vec<Node>> {
    let data_path = std::path::Path::new("../../datasets/infrastructure/nodes.csv");
    let content = tokio::fs::read_to_string(data_path).await?;
    
    let mut reader = csv::Reader::from_reader(content.as_bytes());
    let mut nodes = Vec::new();
    
    for result in reader.deserialize() {
        let node: Node = result?;
        nodes.push(node);
    }
    
    Ok(nodes)
}
