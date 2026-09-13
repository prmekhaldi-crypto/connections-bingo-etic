import './style.css';
import { renderGame } from './game';

const container = document.querySelector<HTMLDivElement>('#app');

if (container) {
  renderGame(container);
}
