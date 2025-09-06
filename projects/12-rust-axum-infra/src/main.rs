use axum::{routing::get, Router};
use tower_http::trace::TraceLayer;
use tracing_subscriber;

mod handlers;
mod models;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::init();

    let app = Router::new()
        .route("/health", get(handlers::health))
        .route("/nodes", get(handlers::nodes))
        .layer(TraceLayer::new_for_http());

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3004")
        .await?;
    
    tracing::info!("listening on {}", listener.local_addr()?);
    axum::serve(listener, app).await?;
    
    Ok(())
}
