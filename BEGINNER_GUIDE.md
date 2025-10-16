# Einstieg in die Codebasis "El Pollo Loco"

Diese Codebasis implementiert ein kleines 2D-Browserspiel auf Canvas-Basis. Die wichtigsten Bausteine sind HTML für das Grundgerüst, CSS für das Layout und mehrere JavaScript-Dateien, die Spiellogik und Objekte modellieren.

## Gesamtaufbau

| Bereich | Dateien | Aufgabe |
| --- | --- | --- |
| Einstiegspunkt | [`index.html`](index.html) | Lädt alle Skripte und startet das Spiel per `init()` beim Seitenaufruf. Enthält das `<canvas>`-Element, in das gezeichnet wird. |
| Styling | [`style.css`](style.css) | Legt Schriftarten, Hintergrundfarben und Canvas-Größe fest. |
| Spiel-Setup | [`java_script/game.js`](java_script/game.js) | Initialisiert `World` und `Keyboard`, reagiert auf Tastendrücke und übergibt sie an die Spiellogik. |
| Modelle | Dateien im Ordner [`models`](models) | Enthalten Klassen für Spielfiguren, Gegner, Hintergrund und Hilfsklassen wie Tastatur, Status-Anzeige oder Welt. |
| Level-Daten | [`levels/level1.js`](levels/level1.js) | Baut Level-Objekte zusammen (Gegner, Wolken, Hintergrundschichten). |
| Assets | Ordner [`img`](img) | Sprites und UI-Bilder, die von den Modellen geladen werden. |

Der Browser lädt die Dateien in dieser Reihenfolge, sodass Klassen verfügbar sind, bevor sie in späteren Skripten verwendet werden.【F:index.html†L1-L45】 Anschließend ruft `init()` aus `game.js` den Konstruktor der `World` auf, wodurch das Spiel startet.【F:java_script/game.js†L1-L34】

## Wichtigste Klassenhierarchie

Die Spiellogik folgt einer klaren Vererbungskette:

```
drawableObject
  └─ MovableObject
      ├─ Character
      ├─ Chicken
      ├─ Endboss
      ├─ Cloud
      └─ ThrowablaObject
```

- **`drawableObject`** verwaltet grundlegende Zeichenfunktionen wie das Laden von Bildern (`loadImage`) und das Rendern auf dem Canvas (`draw`).【F:models/drawable-object.class.js†L1-L36】
- **`MovableObject`** erweitert dies um Bewegung, Schwerkraft, Animationen und Kollisionsabfragen.【F:models/movableObject.class.js†L1-L55】
- **Spezifische Klassen** wie `Character`, `Chicken`, `Endboss` oder `Cloud` laden passende Sprites, setzen Startpositionen und definieren Animationen.【F:models/character.class.js†L1-L87】【F:models/chicken.class..js†L1-L29】【F:models/endboss.class.js†L1-L26】【F:models/cloud.class.js†L1-L18】
- **`ThrowablaObject`** repräsentiert geworfene Flaschen; die Klasse zeigt, wie Projektile Schwerkraft und eigene Bewegung kombinieren.【F:models/throwable-object.class.js†L1-L18】

Die `World`-Klasse hält Referenzen auf alle Spielobjekte, übernimmt das Zeichnen pro Frame und steuert Kollisionen sowie Kamera-Verschiebung.【F:models/world.class.js†L1-L86】

## Input, Spielschleife und Level

- **Tastatursteuerung:** `game.js` legt einen `Keyboard`-Controller an und setzt bei `keydown`/`keyup` die entsprechenden Flags. Die `Character`-Klasse liest diese Flags in `animate()` aus und bewegt sich entsprechend.【F:java_script/game.js†L1-L34】【F:models/keyboard.class.js†L1-L8】【F:models/character.class.js†L35-L79】
- **Rendering-Schleife:** `World.draw()` räumt den Canvas auf, verschiebt die Kamera, rendert Objekte und ruft sich mit `requestAnimationFrame` selbst erneut auf – so entsteht die konstante Bildwiederholung.【F:models/world.class.js†L37-L69】
- **Kollisionen & Aktionen:** `World.run()` prüft regelmäßig auf Zusammenstöße zwischen Spieler und Gegnern und erzeugt geworfene Objekte, wenn die Taste `D` gedrückt wird.【F:models/world.class.js†L23-L36】
- **Level-Konfiguration:** `levels/level1.js` erstellt eine `Level`-Instanz mit Gegnern, Wolken und sich wiederholenden Hintergrundbildern. Diese Daten liest die `World`, um alle Objekte zu initialisieren.【F:levels/level1.js†L1-L32】【F:models/level.class.js†L1-L12】

## Was sollte man als Anfänger lernen?

1. **Grundlagen des Canvas**: Wie `drawImage`, `clearRect` und Koordinatensysteme funktionieren, da `World.draw()` direkt auf dem Canvas arbeitet.【F:models/world.class.js†L37-L69】
2. **JavaScript-Klassen & Vererbung**: Die Struktur basiert stark auf ES6-Klassen. Verstehe Konstruktoren, `super()`-Aufrufe und das Überschreiben von Methoden.【F:models/character.class.js†L1-L87】【F:models/movableObject.class.js†L1-L55】
3. **Asynchrone Abläufe**: Viele Aktionen (Animation, Bewegung, Eingabe) laufen über `setInterval` und `requestAnimationFrame`. Lerne, wie Timer beeinflussen, was pro Frame passiert.【F:models/character.class.js†L41-L82】【F:models/world.class.js†L37-L69】
4. **Zustand & Kollisionen**: Die Energieanzeige (`StatusBar`) reagiert auf Treffer; dazu gehört das Verständnis von Zustand (`energy`, `lastHit`) und simpler Kollisionslogik.【F:models/movableObject.class.js†L23-L55】【F:models/status-bar.class.js†L1-L35】
5. **Modularer Aufbau**: Obwohl alles mit `<script>`-Tags geladen wird, sind die Dateien logisch getrennt. Achte auf Lade-Reihenfolge und Dateinamen – Tippfehler (z. B. doppelte Punkte) können zu Ladefehlern führen.【F:index.html†L11-L25】

## Nächste Schritte zum Experimentieren

- Passe Werte wie `speed`, `height` oder Animationsintervalle an, um direkt zu sehen, wie sich Objekte verhalten.【F:models/character.class.js†L1-L87】【F:models/chicken.class..js†L10-L27】
- Ergänze ein zweites Level: Kopiere `levels/level1.js`, ändere Gegner- und Hintergrundlisten und verknüpfe es in der `World`.
- Verbessere die Steuerung: Erweitere `Keyboard` und die Event-Listener in `game.js`, um weitere Aktionen zu unterstützen.【F:java_script/game.js†L13-L34】【F:models/keyboard.class.js†L1-L8】

Mit diesem Überblick kannst du gezielt in den Dateien nachsehen und einzelne Mechaniken Schritt für Schritt verstehen.
