async function run() {
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyAcKeJtBUdNfwg1BYb_WjkuWJFMA960lKY");
  const data = await response.json();
  console.log(data);
}
run();
