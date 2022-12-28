<template>
  <MainWindow/>
</template>

<script>
import MainWindow from './components/MainWindow.vue'

export default {
  name: 'App',
  components: {
    MainWindow
  }
}
</script>

<style>
/* Настройка css */

/* Указываем box sizing */
*,
*::before,
*::after {
	box-sizing: border-box;
}

/* Убираем внутренние отступы */
ul[class],
ol[class] {
	padding: 0;
}

/* Убираем внешние отступы */
body,
h1,
h2,
h3,
h4,
p,
ul[class],
ol[class],
li,
figure,
figcaption,
blockquote,
dl,
dd {
	margin: 0;
}

/* Удаляем стандартную стилизацию для всех ul и il, у которых есть атрибут class*/
ul[class],
ol[class] {
	list-style: none;
}

/* Стили для форм */
.modal-layout {
    position: fixed;
    z-index: 1;
    background-color: rgba(211, 211, 211, 0.5);
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
}

.form {
    display: flex;
    flex-direction: column;
    background-color: white;
    border: 2px solid black;
    width: 44rem;
    padding: 5px;
    gap: 10px;
    overflow: auto;
    max-height: 90%;
}

.form__head {
    margin-top: -5px;
    margin-left: -5px;
    margin-right: -5px;
    text-align: center;
    background-color: lightgray;
    font-weight: bolder;
    padding: 5px;
    border-bottom: 2px solid black;
}

.form__field {
   display: flex;
   gap: 5px;
}

.form__lists {
  display: flex;
  justify-content: space-between;
}

.form__list {
  width: 48%;
  height: 10rem;
  border: 2px solid black;
  overflow: auto;
}

.form__list-head {
  display: flex;
  justify-content: space-between;
  text-align: center;
  background-color: lightgray;
  padding: 2px;
  border-bottom: 2px solid black;
  font-weight: bolder;
}

.form__list-body {
  width: 100%;
}

.form__list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

/*Таблица в форме */
.form__table-window {
  border: 2px solid black;
}

.form__table-container {
  width: 100%;
  overflow: auto;
  padding: 10px;
  min-height: 8rem;
}

.form__table-name {
  display: flex;
  justify-content: space-between;
  background-color: lightgray;
  font-weight: bolder;
  border-bottom: 2px solid black;
  padding: 2px;
}

.form__table-name-text {
  text-align: center;
}
/* */

.form__buttons {
    display: flex;
    justify-content: space-between;    
}

.form__button {
    width: 48%;
    height: 3rem;
    padding: 5px;
    background-color: lightgray;
}

.form__button:hover {
    text-decoration: underline;
    cursor: pointer;
}

/*Переполнение с многоточием */
.overflow-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
