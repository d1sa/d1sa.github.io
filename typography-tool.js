#!/usr/bin/env node

/**
 * Typography Tool - утилита для улучшения типографики в HTML файлах
 * Автоматически расставляет неразрывные пробелы согласно правилам русской типографики
 *
 * Версия 1.1.0 - исправлена проблема с двойными пробелами:
 * - Добавлена нормализация существующих &nbsp; перед обработкой
 * - Улучшен паттерн для предлогов (теперь работает в начале строк и после знаков препинания)
 * - Добавлена финальная очистка от случайных двойных пробелов
 * - Исключает проблемы вида "&nbsp; " (неразрывный пробел + обычный пробел)
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { Command } = require('commander');

class TypographyProcessor {
  constructor() {
    // Неразрывный пробел (Unicode: U+00A0)
    this.nbsp = '\u00A0';

    // Правила замены обычных пробелов на неразрывные
    this.rules = [
      // Предлоги и союзы (1-3 буквы) - универсальный паттерн
      {
        pattern: /(^|[\s\.,;:!?\-—])([а-яё]{1,3})(\s)/gim,
        replacement: (match, before, word, space) => {
          const shortWords = [
            'в',
            'во',
            'на',
            'за',
            'по',
            'до',
            'от',
            'со',
            'из',
            'к',
            'ко',
            'о',
            'об',
            'при',
            'про',
            'под',
            'над',
            'без',
            'для',
            'через',
            'у',
            'с',
            'и',
            'а',
            'но',
            'да',
            'или',
            'что',
            'как',
            'же',
            'ли',
            'бы',
            'не',
            'ни',
            'то',
            'ту',
            'те',
            'та',
          ];
          if (shortWords.includes(word.toLowerCase())) {
            // Заменяем: before + word + неразрывный пробел
            return `${before}${word}${this.nbsp}`;
          }
          return match;
        },
      },

      // Знак рубля и другие валютные символы
      {
        pattern: /(\d+)\s*(руб\.?|рублей?|рубля?|₽)/gi,
        replacement: `$1${this.nbsp}$2`,
      },

      // Единицы измерения
      {
        pattern: /(\d+)\s*(м|км|см|мм|кг|г|т|л|мл|шт\.?|штук?|штуки?)/gi,
        replacement: `$1${this.nbsp}$2`,
      },

      // Даты с годом
      {
        pattern:
          /(\d{1,2})\s+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)\s+(\d{4})/gi,
        replacement: `$1${this.nbsp}$2${this.nbsp}$3`,
      },

      // Время
      {
        pattern:
          /(\d{1,2})\s*(ч\.?|час\.?|часов?|мин\.?|минут?|сек\.?|секунд?)/gi,
        replacement: `$1${this.nbsp}$2`,
      },

      // Проценты
      {
        pattern: /(\d+)\s*(%|процент[а-я]*)/gi,
        replacement: `$1${this.nbsp}$2`,
      },

      // Номера телефонов (защита от разрыва)
      {
        pattern: /(\+7|8)\s*(\d{3})\s*(\d{3})\s*(\d{2})\s*(\d{2})/g,
        replacement: `$1${this.nbsp}$2${this.nbsp}$3-$4-$5`,
      },

      // Инициалы
      {
        pattern: /([А-ЯЁ]\.)\s*([А-ЯЁ]\.)\s*([А-ЯЁ][а-яё]+)/g,
        replacement: `$1${this.nbsp}$2${this.nbsp}$3`,
      },

      // Сокращения
      {
        pattern: /(\d+)\s*(кв\.м|м²|м2)/gi,
        replacement: `$1${this.nbsp}$2`,
      },

      // "до" и "от" с числами
      {
        pattern: /(до|от)\s+(\d+)/gi,
        replacement: `$1${this.nbsp}$2`,
      },

      // "с" и "по" с датами/числами
      {
        pattern: /(с|по)\s+(\d+)/gi,
        replacement: `$1${this.nbsp}$2`,
      },
    ];
  }

  /**
   * Обрабатывает текст согласно правилам типографики
   * @param {string} text - исходный текст
   * @returns {string} обработанный текст
   */
  processText(text) {
    let processedText = text;

    // Сначала нормализуем все пробелы: убираем существующие &nbsp; и заменяем на обычные пробелы
    processedText = processedText.replace(/\u00A0/g, ' ');

    // Убираем лишние пробелы (множественные пробелы заменяем на одинарные)
    processedText = processedText.replace(/\s+/g, ' ');

    // Применяем все правила последовательно
    this.rules.forEach(rule => {
      if (typeof rule.replacement === 'function') {
        processedText = processedText.replace(
          rule.pattern,
          rule.replacement.bind(this)
        );
      } else {
        processedText = processedText.replace(rule.pattern, rule.replacement);
      }
    });

    // Финальная очистка: убираем случайные двойные пробелы между nbsp и обычными пробелами
    processedText = processedText.replace(/\u00A0\s+/g, this.nbsp);
    processedText = processedText.replace(/\s+\u00A0/g, this.nbsp);

    return processedText;
  }

  /**
   * Рекурсивно обрабатывает все текстовые узлы в DOM элементе
   * @param {Element} element - DOM элемент
   */
  processElement(element) {
    // Пропускаем элементы, которые не должны обрабатываться
    const skipTags = ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE'];

    if (skipTags.includes(element.tagName)) {
      return;
    }

    // Обрабатываем дочерние узлы
    for (let child of element.childNodes) {
      if (child.nodeType === 3) {
        // TEXT_NODE
        const originalText = child.textContent;
        const processedText = this.processText(originalText);

        if (originalText !== processedText) {
          child.textContent = processedText;
        }
      } else if (child.nodeType === 1) {
        // ELEMENT_NODE
        this.processElement(child);
      }
    }
  }

  /**
   * Обрабатывает HTML файл
   * @param {string} filePath - путь к HTML файлу
   * @returns {Promise<Object>} результат обработки
   */
  async processFile(filePath) {
    try {
      // Проверяем существование файла
      if (!fs.existsSync(filePath)) {
        throw new Error(`Файл не найден: ${filePath}`);
      }

      // Читаем содержимое файла
      const html = fs.readFileSync(filePath, 'utf8');
      console.log(`📖 Чтение файла: ${filePath}`);

      // Создаем DOM
      const dom = new JSDOM(html);
      const document = dom.window.document;

      // Подсчитываем изменения для статистики
      let changesCount = 0;
      const originalTexts = [];
      const processedTexts = [];

      // Собираем все текстовые узлы перед обработкой
      this.collectTextNodes(document.body, originalTexts);

      // Обрабатываем document.body
      this.processElement(document.body);

      // Собираем обработанные тексты
      this.collectTextNodes(document.body, processedTexts);

      // Подсчитываем изменения
      for (
        let i = 0;
        i < Math.min(originalTexts.length, processedTexts.length);
        i++
      ) {
        if (originalTexts[i] !== processedTexts[i]) {
          changesCount++;
        }
      }

      // Получаем обновленный HTML
      const updatedHtml = dom.serialize();

      // Записываем обратно в файл
      fs.writeFileSync(filePath, updatedHtml, 'utf8');

      return {
        success: true,
        filePath,
        changesCount,
        message: `✅ Обработка завершена! Внесено изменений: ${changesCount}`,
      };
    } catch (error) {
      return {
        success: false,
        filePath,
        error: error.message,
        message: `❌ Ошибка при обработке файла: ${error.message}`,
      };
    }
  }

  /**
   * Собирает все текстовые узлы из элемента
   * @param {Element} element - DOM элемент
   * @param {Array} textArray - массив для сбора текстов
   */
  collectTextNodes(element, textArray) {
    const skipTags = ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE'];

    if (skipTags.includes(element.tagName)) {
      return;
    }

    for (let child of element.childNodes) {
      if (child.nodeType === 3) {
        // TEXT_NODE
        textArray.push(child.textContent);
      } else if (child.nodeType === 1) {
        // ELEMENT_NODE
        this.collectTextNodes(child, textArray);
      }
    }
  }

  /**
   * Обрабатывает множественные файлы
   * @param {Array<string>} filePaths - массив путей к файлам
   * @returns {Promise<Array>} результаты обработки
   */
  async processFiles(filePaths) {
    const results = [];

    for (const filePath of filePaths) {
      const result = await this.processFile(filePath);
      results.push(result);
      console.log(result.message);
    }

    return results;
  }
}

// CLI интерфейс
const program = new Command();

program
  .name('typography-tool')
  .description('Утилита для улучшения типографики в HTML файлах')
  .version('1.0.0');

program
  .argument('<files...>', 'HTML файлы для обработки')
  .option('-v, --verbose', 'подробный вывод')
  .action(async (files, options) => {
    const processor = new TypographyProcessor();

    console.log('🔧 Запуск утилиты типографики...\n');

    if (options.verbose) {
      console.log(`📋 Файлы для обработки: ${files.join(', ')}`);
      console.log('');
    }

    // Обрабатываем файлы
    const results = await processor.processFiles(files);

    // Выводим итоговую статистику
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const totalChanges = results.reduce(
      (sum, r) => sum + (r.changesCount || 0),
      0
    );

    console.log('\n📊 Итоговая статистика:');
    console.log(`✅ Успешно обработано: ${successful} файл(ов)`);
    console.log(`❌ Ошибок: ${failed}`);
    console.log(`🔄 Всего изменений: ${totalChanges}`);

    if (failed > 0) {
      process.exit(1);
    }
  });

// Обработка случая, когда файлы не указаны
if (process.argv.length < 3) {
  console.log('❗ Использование: npm run typography <файлы>');
  console.log('📝 Пример: npm run typography src/index.html');
  console.log('📝 Пример: npm run typography src/*.html');
  process.exit(1);
}

program.parse();
