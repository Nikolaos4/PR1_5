import React, { useEffect, useState } from 'react';
// Подключаем стили для этой страницы (будут скомпилированы из SCSS)
import './ProductsPage.scss';
// Импортируем компоненты
import ProductsList from '../../components/ProductsList';
import ProductModal from '../../components/ProductModal';
// Импортируем объект api для запросов к серверу
import { api } from '../../api';

export default function ProductsPage() {
  // Состояние: список товаров (изначально пустой)
  const [products, setProducts] = useState([]);
  // Состояние: флаг загрузки (показываем спиннер/сообщение)
  const [loading, setLoading] = useState(true);
  // Состояние: открыто ли модальное окно
  const [modalOpen, setModalOpen] = useState(false);
  // Состояние: режим модалки ('create' или 'edit')
  const [modalMode, setModalMode] = useState('create');
  // Состояние: товар, который сейчас редактируется (null при создании)
  const [editingProduct, setEditingProduct] = useState(null);

  // Загружаем товары при первом рендере компонента
  useEffect(() => {
    loadProducts();
  }, []); // Пустой массив зависимостей – эффект выполнится только один раз после монтирования

  // Асинхронная функция загрузки товаров с сервера
  const loadProducts = async () => {
    try {
      setLoading(true); // начинаем загрузку
      const data = await api.getProducts(); // запрос к бэкенду
      setProducts(data); // сохраняем полученные данные в состояние
    } catch (err) {
      console.error(err);
      alert('Ошибка загрузки товаров');
    } finally {
      setLoading(false); // загрузка завершена (успешно или с ошибкой)
    }
  };

  // Открыть модалку в режиме создания
  const openCreate = () => {
    setModalMode('create');
    setEditingProduct(null); // никакого товара для редактирования нет
    setModalOpen(true);
  };

  // Открыть модалку в режиме редактирования для конкретного товара
  const openEdit = (product) => {
    setModalMode('edit');
    setEditingProduct(product); // запоминаем товар для редактирования
    setModalOpen(true);
  };

  // Закрыть модалку и сбросить редактируемый товар
  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  // Удалить товар по ID (с подтверждением)
  const handleDelete = async (id) => {
    const ok = window.confirm('Удалить товар?');
    if (!ok) return;
    try {
      await api.deleteProduct(id); // отправляем DELETE-запрос
      // Обновляем состояние, удаляя товар из массива
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Ошибка удаления товара');
    }
  };

  // Обработчик отправки данных из модалки (создание или обновление)
  const handleSubmitModal = async (payload) => {
    try {
      if (modalMode === 'create') {
        // Создание: вызываем api.createProduct, добавляем новый товар в список
        const newProduct = await api.createProduct(payload);
        setProducts((prev) => [...prev, newProduct]);
      } else {
        // Редактирование: вызываем api.updateProduct, заменяем старый товар обновлённым
        const updatedProduct = await api.updateProduct(payload.id, payload);
        setProducts((prev) => prev.map((p) => (p.id === payload.id ? updatedProduct : p)));
      }
      closeModal(); // закрываем модалку после успеха
    } catch (err) {
      console.error(err);
      alert('Ошибка сохранения товара');
    }
  };

  return (
    <div className="page">
      {/* Шапка страницы */}
      <header className="header">
        <div className="header__inner">
          <div className="brand">Магазин товаров</div>
          <div className="header__right">React</div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="main">
        <div className="container">
          <div className="toolbar">
            <h1 className="title">Товары</h1>
            {/* Кнопка создания товара */}
            <button className="btn btn--primary" onClick={openCreate}>+ Создать</button>
          </div>
          {/* Если загрузка – показываем сообщение, иначе список товаров */}
          {loading ? (
            <div className="empty">Загрузка...</div>
          ) : (
            <ProductsList
              products={products}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>

      {/* Подвал страницы */}
      <footer className="footer">
        <div className="footer__inner">© {new Date().getFullYear()} Магазин товаров</div>
      </footer>

      {/* Модальное окно для создания/редактирования товара */}
      <ProductModal
        open={modalOpen}
        mode={modalMode}
        initialProduct={editingProduct}
        onClose={closeModal}
        onSubmit={handleSubmitModal}
      />
    </div>
  );
}