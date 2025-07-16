# Development Guide

## 🏗️ Архитектура SCSS

Проект использует модульную архитектуру SCSS с разделением по назначению:

### 📁 Структура файлов

```
src/scss/
├── abstracts/           # Переменные, миксины, функции
│   ├── _variables.scss  # Цвета, размеры, шрифты
│   ├── _mixins.scss     # Переиспользуемые стили
│   ├── _functions.scss  # Вспомогательные функции
│   └── _index.scss      # Экспорт всех abstracts
├── base/                # Базовые стили
│   ��── _reset.scss      # Сброс браузерных стилей
│   ├── _typography.scss # Типографика
│   └── _index.scss      # Экспорт всех base
├── layout/              # Структура страницы
│   ├── _container.scss  # Контейнеры
│   ├── _header.scss     # Шапка сайта
│   ├── _footer.scss     # Подвал сайта
│   └── _index.scss      # Экспорт всех layout
├── components/          # Компоненты
│   ├── _buttons.scss    # Кнопки
│   ├── _forms.scss      # Формы
│   └── _index.scss      # Экспорт всех components
├── pages/               # Стили страниц
│   ├── _hero.scss       # Главная секция
│   ├── _advantages.scss # Преимущества
│   ├── _profile-comparison.scss # Сравнение профилей
│   └── _index.scss      # Экспорт всех pages
├── utilities/           # Утилиты
│   ├── _utilities.scss  # Вспомогательные классы
│   └── _index.scss      # Экспорт всех utilities
└── main.scss            # Главный файл
```

## 🎨 Работа с переменными

### Цвета

```scss
// Основные цвета
$color-primary: #268ceb; // Синий
$color-secondary: #2bb109; // Зеленый
$color-accent: #f60; // Оранжевый

// Цвета текста
$color-text-primary: #000;
$color-text-secondary: rgba(0, 0, 0, 0.5);
$color-text-muted: rgba(0, 0, 0, 0.6);

// Фоны
$color-bg-primary: #fff;
$color-bg-secondary: #f2f5fa;
```

### Типографика

```scss
// Семейства шрифтов
$font-family-primary: 'Inter', sans-serif;
$font-family-secondary: 'Geologica', sans-serif;

// Размеры шрифтов
$font-size-xs: 12px;
$font-size-sm: 13px;
$font-size-base: 16px;
$font-size-lg: 17px;
$font-size-xl: 24px;
$font-size-2xl: 30px;
$font-size-3xl: 32px;
$font-size-4xl: 48px;
$font-size-5xl: 68px;
```

### Отступы

```scss
// Система отступов
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 12px;
$spacing-lg: 16px;
$spacing-xl: 20px;
$spacing-2xl: 24px;
$spacing-3xl: 32px;
$spacing-4xl: 40px;
$spacing-5xl: 48px;
$spacing-6xl: 56px;
$spacing-7xl: 64px;
$spacing-8xl: 96px;
```

## 🔧 Работа с миксинами

### Контейнер

```scss
.my-section {
  @include container; // Добавляет max-width �� центрирование
}
```

### Flexbox

```scss
.my-element {
  @include flex-center; // display: flex + центрирование
  @include flex-between; // display: flex + space-between
  @include flex-column; // display: flex + flex-direction: column
}
```

### Кнопки

```scss
.my-button {
  @include btn-base; // Базовые стили кнопки
}
```

### Адаптивность

```scss
.my-element {
  font-size: 24px;

  @include mobile {
    font-size: 18px; // На мобильных устройствах
  }

  @include tablet {
    font-size: 20px; // На планшетах
  }
}
```

## 📱 Breakpoints

```scss
$breakpoint-sm: 576px; // Маленькие устройства
$breakpoint-md: 768px; // Планшеты
$breakpoint-lg: 991px; // Десктоп
$breakpoint-xl: 1200px; // Большие экраны
$breakpoint-2xl: 1400px; // Очень большие экраны
```

## 🚀 Команды разработки

### Разработка

```bash
npm run dev          # Запуск сервера + watch
npm run watch        # Только отслеживание SCSS
npm start           # Полный запуск разработки
```

### Сборка

```bash
npm run build        # Быстрая сборка
npm run build:prod   # Полная сборка с оптимизацией
npm test            # Проверки + сборка
```

### Код качество

```bash
npm run lint         # Проверка всех файлов
npm run lint:scss    # Проверка только SCSS
npm run format       # Форматирование кода
npm run validate     # Полная валидация
```

## 📝 Соглашения по кодированию

### Именование классов

```scss
// ✅ Хорошо
.hero-section {
}
.hero-title {
}
.btn-primary {
}
.form-input {
}

// ❌ Плохо
.heroSection {
}
.Hero_Title {
}
.btnPrimary {
}
.form__input {
}
```

### Структура SCSS файла

```scss
// ==========================================================================
// Название компонента
// ==========================================================================

// Основные стили
.component {
  property: value;

  // Вложенные элементы
  &-element {
    property: value;
  }

  // Модификаторы
  &--modifier {
    property: value;
  }

  // Состояния
  &:hover,
  &:focus {
    property: value;
  }
}

// Адаптивность
@include mobile {
  .component {
    property: value;
  }
}
```

### Порядок свойств

```scss
.example {
  // Позиционирование
  position: relative;
  top: 0;
  left: 0;
  z-index: 1;

  // Размеры
  width: 100%;
  height: auto;

  // Flexbox/Grid
  display: flex;
  align-items: center;
  justify-content: center;

  // Отступы
  margin: 0;
  padding: 16px;

  // Фон и границы
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;

  // Текст
  color: #000;
  font-size: 16px;
  font-weight: 400;
  text-align: center;

  // Прочее
  cursor: pointer;
  transition: all 0.3s ease;
}
```

## 🔍 Отладка

### Проверка компиляции

```bash
# Компиляция с подробным выводом
npx sass src/scss/main.scss:dist/css/style.css --verbose

# Проверка синтаксиса
npm run lint:scss
```

### Проверка сгенерированного CSS

```bash
# Просмотр размера файлов
ls -lh dist/css/

# Просмотр содержимого
cat dist/css/style.css | head -20
```

## 🐛 Решение проблем

### Ошибка "Undefined variable"

```scss
// �� Переменная не импортирована
.example {
  color: $color-primary; // Ошибка!
}

// ✅ Импорт в начале файла
@import 'abstracts/variables';

.example {
  color: $color-primary; // Работает!
}
```

### Ошибка "Undefined mixin"

```scss
// ❌ Миксин не импортирован
.example {
  @include flex-center; // Ошибка!
}

// ✅ Импорт в начале файла
@import 'abstracts/mixins';

.example {
  @include flex-center; // Работает!
}
```

### Стили не применяются

1. Проверьте, что SCSS компилируется без ошибок
2. Убедитесь, что CSS файл подключен в HTML
3. Проверьте специфичность селекторов
4. Очистите кеш браузера

## 🎯 Лучшие практики

1. **Используйте переменные** для повторяющихся значений
2. **Группируйте связанные стили** в отдельные файлы
3. **Следуйте BEM-подобному именованию** классов
4. **Пишите мобильные стили сначала** (mobile-first)
5. **Используйте миксины** для повторяющихся паттернов
6. **Комментируйте сложную логику** в SCSS
7. **Тестируйте на разных устройствах** и браузерах
