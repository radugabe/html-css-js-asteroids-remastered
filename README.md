# Asteroids 2.0
Proiectul presupune dezvoltarea unui joc similar cu clasicul Asteroids (mai multe detalii despre joc original: Asteroids) utilizând elemente grafice HTML5 precum <canvas> sau <svg>. Regulile implementate în acest joc respectă cerințele de mai jos, chiar dacă acestea diferă de regulile standard ale jocului original.

Funcționalități implementate
1. Asteroizi
Reprezentare:

Asteroizii sunt reprezentați sub formă de cercuri.
Fiecare asteroid are asociată o valoare generată aleator (în intervalul 1-4), care indică numărul de rachete necesare pentru distrugerea acestuia.
Numărul de rachete necesare este afișat permanent în interiorul desenului asteroidului.
Dimensiuni și culori:

Dimensiunea și culoarea asteroidului se schimbă în funcție de valoarea sa:
Valoare mare → dimensiune mai mare și culoare mai intensă.
Valoare mică → dimensiune mai mică și culoare mai deschisă.
Deplasare:

Asteroizii se deplasează pe traiectorii liniare.
Viteza fiecărui asteroid este generată aleator.
2. Navă spațială
Reprezentare:
Nava este desenată sub formă de triunghi.
Control:
Nava poate fi controlată cu tastatura, utilizând următoarele comenzi:
Săgețile: deplasare sus/jos/stânga/dreapta cu viteză constantă.
Z: rotire spre stânga.
C: rotire spre dreapta.
X: lansare rachetă în direcția curentă a navei.
Notă: Nava poate să se deplaseze în orice direcție, indiferent de orientarea sa curentă.
3. Rachete
Reprezentare și deplasare:
Rachetele sunt vizibile pe parcursul deplasării de la navă către asteroid.
Funcționalitate:
Se detectează coliziunea rachetei cu asteroidul, iar valoarea asteroidului scade corespunzător cu fiecare coliziune.
Se permite lansarea a maximum 3 rachete simultan.
4. Coliziuni între asteroizi
Dacă doi asteroizi se ciocnesc:
Traiectoriile lor se modifică în urma coliziunii.
5. Coliziuni între navă și asteroizi
Dacă nava se ciocnește cu un asteroid:
Se reduce numărul de vieți ale jucătorului.
Jocul reporneste de la starea inițială.
Jocul se termină când numărul de vieți ajunge la 0.
6. Regenerare vieți
Fiecare asteroid distrus oferă un anumit număr de puncte.
La atingerea unui scor predefinit, jucătorul primește o viață suplimentară.
7. Control touchscreen
Jocul poate fi controlat și prin touchscreen, pentru dispozitive mobile:
Deplasare prin gesturi.
Lansarea rachetelor prin tap.
8. Stocarea scorurilor
Cele mai bune 5 scoruri obținute sunt stocate împreună cu numele jucătorilor.
Stocarea se face utilizând Web Storage API sau un API similar.
Tehnologii utilizate
HTML5:
<canvas> sau <svg> pentru redarea elementelor grafice.
CSS3:
Pentru stilizarea interfeței utilizatorului.
JavaScript:
Logica jocului și implementarea funcționalităților (coliziuni, control, etc.).
Utilizarea Web Storage API pentru salvarea scorurilor.
Event Listeners:
Pentru controlul navei cu tastatura și gesturi touchscreen.
