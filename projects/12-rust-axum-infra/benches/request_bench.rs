use criterion::{black_box, criterion_group, criterion_main, Criterion};

fn benchmark_request_parsing(c: &mut Criterion) {
    c.bench_function("parse_nodes_csv", |b| {
        b.iter(|| {
            let csv_data = "id,hostname,region,status,cpu_pct,memory_pct\nnode1,web-us-east-1a,us-east-1,HEALTHY,45.2,67.8";
            black_box(csv_data.len())
        })
    });
}

criterion_group!(benches, benchmark_request_parsing);
criterion_main!(benches);
