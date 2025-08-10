import cssModule from 'bundle-text:../styles/main.critical.scss';

console.log('cssModule');
console.log(cssModule);

const css =
  typeof cssModule === 'string'
    ? cssModule
    : (cssModule && cssModule.default) || '';

if (typeof document !== 'undefined' && css) {
  const id = 'critical-styles';
  let style = document.getElementById(id);
  if (!style) {
    style = document.createElement('style');
    style.id = id;
    style.setAttribute('data-inline', 'true');
    (document.head || document.getElementsByTagName('head')[0]).prepend(style);
  }
  style.textContent = css;

  if (import.meta && import.meta.hot) {
    import.meta.hot.accept(() => {
      style.textContent =
        typeof cssModule === 'string'
          ? cssModule
          : (cssModule && cssModule.default) || '';
    });
  }
}
