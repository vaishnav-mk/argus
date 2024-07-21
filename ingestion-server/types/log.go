package types

type Log struct {
	Level      string                 `json:"level"`
	Message    string                 `json:"message"`
	ResourceID string                 `json:"resourceID"`
	Timestamp  string                 `json:"timestamp"`
	TraceID    string                 `json:"spanID"`
	SpanID     string                 `json:"traceID"`
	Commit     string                 `json:"commit"`
	Metadata   map[string]interface{} `json:"metadata"`
	Service    string                 `json:"service"`
}

type Message struct {
	Topic   string `json:"topic"`
	Message Log    `json:"message"`
}
