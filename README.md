# 🌍 Projeto de Rastreamento com Mapas - Next.js + Leaflet
Este é um site de rastreamento em tempo real desenvolvido com Next.js e o framework de mapas Leaflet, que consome uma API externa para exibir a localização de pessoas ou dispositivos diretamente no mapa.

Ideal para aplicações como:
🔹 Monitoramento de frotas
🔹 Rastreamento de usuários ativos
🔹 Visualização de localização com status em tempo real

🚀 Como começar
Clone o repositório e instale as dependências:

Instalar as dependecias
npm install
# ou
yarn install

Inicie o servidor de desenvolvimento:

npm run dev ou yarn dev

incializar em movo desenvolvedor
#
Abra http://localhost:3000 no seu navegador para visualizar o projeto.

🗺️ Funcionalidades
Exibição de um mapa interativo com Leaflet.

Marcadores personalizados para cada pessoa ou dispositivo.

Informações como status e última requisição exibidas ao clicar nos marcadores.

Centralização automática no primeiro usuário válido ou em uma localização padrão.

Estilização moderna com Tailwind CSS.

📁 Estrutura do Projeto
app/page.tsx: Página principal com chamada para a API.

components/Map.tsx: Componente de mapa que renderiza os marcadores com base nos dados.

lib/api.ts: Requisições para buscar os dados de rastreamento.

📦 Tecnologias Utilizadas
Next.js 14+

React

Leaflet

React Leaflet

Tailwind CSS

📡 API
O projeto consome uma API que retorna uma lista de objetos com as seguintes informações:

ts
Copiar
Editar
{
  latitude: number,
  longitude: number,
  status: string,
  ultimaRequisicao: string
}
Esses dados são transformados em marcadores visuais no mapa.

📦 Deploy
Recomendamos o uso do Vercel para o deploy da aplicação, pois oferece integração nativa com Next.js.

Leia mais sobre o deploy aqui:
📄 Documentação de Deploy do Next.js

📷 Prévia
![image](https://github.com/user-attachments/assets/d13afbf1-b298-409e-bde5-7dc43d073405)
## Deploy on Vercel
