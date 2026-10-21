package com.pricewise.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.Objects;

@Entity
@Table(name = "ingestion_runs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IngestionRun {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "provider_code", nullable = false, length = 100)
    private String providerCode;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 50)
    private IngestionStatus status = IngestionStatus.RUNNING;

    @Builder.Default
    @Column(name = "records_processed", nullable = false)
    private int recordsProcessed = 0;

    @Column(name = "error_summary", columnDefinition = "TEXT")
    private String errorSummary;

    @Builder.Default
    @Column(name = "started_at", nullable = false)
    private Instant startedAt = Instant.now();

    @Column(name = "completed_at")
    private Instant completedAt;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof IngestionRun that)) return false;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "IngestionRun{" +
                "id=" + id +
                ", providerCode='" + providerCode + '\'' +
                ", status=" + status +
                ", recordsProcessed=" + recordsProcessed +
                ", startedAt=" + startedAt +
                ", completedAt=" + completedAt +
                '}';
    }
}
