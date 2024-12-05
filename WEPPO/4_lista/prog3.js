// Worker.prototype = Person.prototype;

// W tym przypadku, Worker i Person dzielą ten sam prototyp, co oznacza, 
// że jeśli dodasz nową właściwość do prototypu Worker, ta sama właściwość pojawi się również w prototypie Person. 
// To nie jest pożądane, ponieważ Worker powinien dziedziczyć po Person, a nie modyfikować go.

// Worker.prototype = new Person();

// W tym przypadku, Worker dziedziczy po instancji Person, a nie po prototypie Person. 
// Oznacza to, że Worker dziedziczy właściwości instancji Person, a nie tylko te zdefiniowane na prototypie Person. 
// Może to prowadzić do nieoczekiwanych wyników, jeśli Person ma właściwości, które są różne dla różnych instancji.