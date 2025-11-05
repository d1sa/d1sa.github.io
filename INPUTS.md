# Компонент Input

Единый компонент для всех инпутов в проекте с единым стилем и различными вариантами.

## Базовый инпут

```html
<input type="text" class="input" placeholder="Введите текст" />
```

## Варианты инпутов

### Телефонный инпут

```html
<input type="tel" class="input input--phone" placeholder="+7" />
```

### Большой инпут

```html
<input type="text" class="input input--large" placeholder="Большой инпут" />
```

### Маленький инпут

```html
<input type="text" class="input input--small" placeholder="Маленький инпут" />
```

### Инпут с иконкой

```html
<input
  type="text"
  class="input input--with-icon"
  placeholder="Инпут с иконкой"
  style="--input-icon: url('path/to/icon.svg')"
/>
```

## Состояния инпутов

### Ошибка

```html
<input type="text" class="input input--error" placeholder="Ошибка" />
```

### Успех

```html
<input type="text" class="input input--success" placeholder="Успех" />
```

### Отключен

```html
<input type="text" class="input" disabled placeholder="Отключен" />
```

## Группы инпутов

### Инпут с кнопкой

```html
<div class="input-with-button">
  <input type="text" class="input" placeholder="Введите текст" />
  <button class="btn btn-primary">Отправить</button>
</div>
```

### Группа инпутов

```html
<div class="input-group">
  <input type="text" class="input" placeholder="Имя" />
  <input type="text" class="input" placeholder="Фамилия" />
</div>
```

## Поле формы с лейблом

```html
<div class="form-field">
  <label class="form-label">Ваше имя</label>
  <input type="text" class="input" placeholder="Введите имя" />
  <div class="form-error">Обязательное поле</div>
</div>
```

## Поле с подсказкой

```html
<div class="form-field">
  <label class="form-label">Email</label>
  <input type="email" class="input" placeholder="example@mail.com" />
  <div class="form-help">Мы не передаем ваш email третьим лицам</div>
</div>
```

## Совместимость с legacy классами

Для обратной совместимости поддерживаются старые классы:

- `.form-input` → `.input`
- `.phone-input` → `.input--phone`

## Особенности

- **Адаптивность**: На мобильных устройствах инпуты с кнопками становятся вертикальными
- **Фокус**: При фокусе появляется синяя рамка с тенью
- **Ховер**: При наведении рамка становится темнее
- **Состояния**: Поддержка состояний ошибки, успеха и отключения
- **Шрифт**: Использует основной шрифт проекта Geologica
- **Анимации**: Плавные переходы для всех состояний

## CSS переменные

Компонент использует переменные из `_variables.scss`:

- `$color-primary` - основной цвет для фокуса
- `$color-success` - цвет успеха
- `$color-text-primary` - основной цвет текста
- `$color-text-muted` - цвет плейсхолдера
- `$spacing-lg` - отступы
- `$border-radius-sm` - радиус скругления
- `$transition-base` - время анимации
