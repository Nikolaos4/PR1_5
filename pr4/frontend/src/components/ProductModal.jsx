import React, { useEffect, useState } from 'react';

// Компонент модального окна для создания/редактирования товара
// Принимает пропсы:
// open – флаг открыто ли окно,
// mode – 'create' или 'edit',
// initialProduct – редактируемый товар (null для создания),
// onClose – функция закрытия,
// onSubmit – функция отправки данных
export default function ProductModal({ open, mode, initialProduct, onClose, onSubmit }) {
  // Локальные состояния для полей формы
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  // Хук эффекта: при открытии окна заполняем поля данными из initialProduct
  useEffect(() => {
    if (!open) return; // если окно закрыто – ничего не делаем
    // Используем optional chaining, чтобы избежать ошибок, если initialProduct = null
    setName(initialProduct?.name ?? '');
    setCategory(initialProduct?.category ?? '');
    setDescription(initialProduct?.description ?? '');
    setPrice(initialProduct?.price != null ? String(initialProduct.price) : '');
    setStock(initialProduct?.stock != null ? String(initialProduct.stock) : '');
  }, [open, initialProduct]); // Эффект зависит от open и initialProduct

  // Если окно не открыто – не рендерим ничего
  if (!open) return null;

  // Заголовок окна зависит от режима
  const title = mode === 'edit' ? 'Редактирование товара' : 'Создание товара';

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault(); // предотвращаем перезагрузку страницы

    // Очищаем поля от пробелов по краям
    const trimmedName = name.trim();
    const trimmedCategory = category.trim();
    const trimmedDesc = description.trim();
    const numPrice = Number(price);
    const numStock = Number(stock);

    // Простейшая валидация
    if (!trimmedName || !trimmedCategory || !trimmedDesc) {
      alert('Заполните все текстовые поля');
      return;
    }
    if (!Number.isFinite(numPrice) || numPrice <= 0) {
      alert('Введите корректную цену (положительное число)');
      return;
    }
    if (!Number.isInteger(numStock) || numStock < 0) {
      alert('Введите корректное количество на складе (целое неотрицательное число)');
      return;
    }

    // Вызываем переданную функцию onSubmit с объектом товара
    onSubmit({
      id: initialProduct?.id, // для создания id будет undefined, для редактирования – существующий
      name: trimmedName,
      category: trimmedCategory,
      description: trimmedDesc,
      price: numPrice,
      stock: numStock,
    });
  };

  return (
    // Затемняющий фон (backdrop) – клик по нему закрывает окно
    <div className="backdrop" onMouseDown={onClose}>
      {/* Само модальное окно – предотвращаем всплытие события клика, чтобы клик внутри не закрывал окно */}
      <div className="modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        {/* Шапка модалки */}
        <div className="modal__header">
          <div className="modal__title">{title}</div>
          <button className="iconBtn" onClick={onClose} aria-label="Закрыть">✕</button>
        </div>
        {/* Форма */}
        <form className="form" onSubmit={handleSubmit}>
          {/* Поле "Название" */}
          <label className="label">
            Название
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Например, Ноутбук" autoFocus />
          </label>
          {/* Поле "Категория" */}
          <label className="label">
            Категория
            <input className="input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Например, Электроника" />
          </label>
          {/* Поле "Описание" */}
          <label className="label">
            Описание
            <textarea className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Краткое описание" rows="2" />
          </label>
          {/* Поле "Цена" */}
          <label className="label">
            Цена (₽)
            <input className="input" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="1000" min="1" step="1" />
          </label>
          {/* Поле "Количество на складе" */}
          <label className="label">
            Количество на складе
            <input className="input" type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="10" min="0" step="1" />
          </label>
          {/* Кнопки внизу модалки */}
          <div className="modal__footer">
            <button type="button" className="btn" onClick={onClose}>Отмена</button>
            <button type="submit" className="btn btn--primary">{mode === 'edit' ? 'Сохранить' : 'Создать'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}