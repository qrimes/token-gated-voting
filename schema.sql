CREATE TABLE votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id TEXT NOT NULL,
    option_text TEXT NOT NULL,
    wallet_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(question_id, wallet_address)
);

CREATE INDEX idx_question_wallet ON votes(question_id, wallet_address);