# SSL

```bash
HOST=cfw.local
echo "127.0.0.1 $HOST" | sudo tee -a /etc/hosts

mkcert -key-file key.pem -cert-file cert.pem $HOST 127.0.0.1
mkcert -install
```
