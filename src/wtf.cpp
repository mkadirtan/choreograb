void myFunc(int i = 5, double d = 1.23){
	etc etc
}

myFunc(15,34.5) //Overrides the default values
myFunc(6) //Overrides the fist argument
myFunc(,34.5) //Error, you can't omit the first parameter.
//-------------------
#include <iostream.h>

void main(){
	cout << "Enter a number: ";
	int n;
	cin >> n;
	cout << "The number is: " << n;
}
//-------------------
for(int ctr = 0; ctr<MAXCTR, ctr++){}
//-------------------
#include <iostream.h>

int amount = 123;

void main(){
	int amount = 456;
	cout << "The number is: " << ::amount; //Global scope: 123
	cout << "/n";
	cout << amount; //Local scope: 456
}