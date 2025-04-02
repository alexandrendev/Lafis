# Estágio único: Servir arquivos estáticos com Nginx
FROM nginx:stable-alpine

# Copia APENAS a pasta dist pronta para o Nginx
COPY ./dist/lafis/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80 e inicia o Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]