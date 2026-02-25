import React from 'react';
import ProductItem from './ProductItem';

// Компонент, отображающий список товаров
// Принимает пропсы: products (массив товаров), onEdit, onDelete

export default function ProductsList({ products, onEdit, onDelete }) {
  // Если массив пуст – показываем сообщение
  if (!products.length) {
    return <div className="empty">Товаров пока нет</div>;
  }
  return (
    // Контейнер для списка
    <div className="list">
      {products.map((p) => (
        <ProductItem key={p.id} product={p} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}