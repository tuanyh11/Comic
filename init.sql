-- Script này sẽ chạy khi container được khởi tạo

-- Tạo DB nếu chưa tồn tại (mặc dù PostgreSQL đã tự tạo qua biến môi trường)
CREATE DATABASE comic WITH OWNER root;

-- Kết nối vào database comic
\c comic

-- Cấp quyền cho user root
ALTER USER root WITH SUPERUSER;

-- Tạo các bảng cần thiết (nếu có)
-- CREATE TABLE example_table (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(255) NOT NULL
-- );

-- Thêm dữ liệu mẫu (nếu cần)
-- INSERT INTO example_table (name) VALUES ('Example Data');