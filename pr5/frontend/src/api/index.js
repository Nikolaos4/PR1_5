import axios from 'axios';

// Создаём экземпляр axios с предварительно настроенными параметрами
const apiClient = axios.create({
  // Базовый URL нашего бэкенда (все запросы будут начинаться с него)
  baseURL: 'http://localhost:3000/api',
  // Заголовки по умолчанию – указываем, что работаем с JSON
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json',
  },
});

// Объект, содержащий методы для работы с API
export const api = {
  // Получить все товары
  getProducts: async () => {
    // Выполняем GET-запрос к /products
    const response = await apiClient.get('/products');
    // Возвращаем только данные из ответа (response.data содержит тело ответа)
    return response.data;
  },
  
  // Получить один товар по его ID
  getProductById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Создать новый товар
  createProduct: async (product) => {
    const response = await apiClient.post('/products', product);
    return response.data;
  },

  // Обновить существующий товар
  updateProduct: async (id, product) => {
    const response = await apiClient.patch(`/products/${id}`, product);
    return response.data;
  },

  // Удалить товар по ID
  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data; // в случае 204 вернётся пустой объект
  },
};