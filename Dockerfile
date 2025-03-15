# Sử dụng image PostgreSQL chính thức
FROM postgres:latest

# Thiết lập các biến môi trường
ENV POSTGRES_DB=comic
ENV POSTGRES_USER=root
ENV POSTGRES_PASSWORD=123456
ENV POSTGRES_HOST_AUTH_METHOD=trust

# Expose port 5432
EXPOSE 5432

# Tạo thư mục dữ liệu
VOLUME ["/var/lib/postgresql/data"]

# Thêm script tạo DB (nếu cần)
COPY ./init.sql /docker-entrypoint-initdb.d/