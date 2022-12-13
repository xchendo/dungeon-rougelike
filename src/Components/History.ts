export function addEvent(text: string) {
  const elem = document.getElementById('player-history');
  const newDiv = document.createElement("span");
  const newContent = document.createTextNode(text);
  newDiv.appendChild(newContent);
  elem?.prepend(newDiv);
}