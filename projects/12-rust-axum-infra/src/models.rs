use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Node {
    pub id: String,
    pub hostname: String,
    pub region: String,
    pub status: String,
    pub cpu_pct: f64,
    pub memory_pct: f64,
}

#[derive(Debug, Serialize)]
pub struct HealthResponse {
    pub status: String,
    pub timestamp: u64,
}
