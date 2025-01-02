<template>
    <div class="text-neutral-400 p-4 py-12 mx-auto max-w-screen-xl ">
        <h1 class="text-white text-bold text-2xl text-yellow-400">Historia wersji</h1>
        <div class="py-2">
            <h2 class="text-white text-bold">v3.0 (03.01.2025)</h2>
            <p>✅ Znaczne przyspieszenie ładowania każdej podstrony przez odłożenie w czasie zapytań do serwera</p>
            <p>✅ Buforowanie w pamięci przeglądarki listy streamerów oraz ich VoDów</p>
            <p>✅ Filtrowanie po miesiącu i roku</p>
            <p>✅ Naprawiono problem z bardzo długimi ciągami znaków w czacie, które powodowały wychodzenie tekstu poza
                obszar
                czatu
            </p>
            <p>✅ Możliwość usuwania filmów z ulubionych</p>
            <p>✅ Nowy widok playera. Nowy wygląd, tryb kinowy</p>
            <p>✅ Dodano "W tym dniu, we wcześniejszych latach" na stronie startowej</p>

            <p>✅ Dodano historię oglądanych filmów</p>



        </div>
        <div class="py-2">
            <h2 class="text-white text-bold">v2.3 (23.08.2024)</h2>
            <p>✅ Linki z aktualnym czasem oglądania (timestamp)</p>
            <p>✅ Kliknięcie w wynik wyszukiwania magicznej wyszukiwarki przenosi do odpowiedniego momentu w filmie
                (timestamp)</p>
        </div>
        <div class="py-2">
            <h2 class="text-white text-bold">v2.2 (15.08.2024)</h2>
            <p>✅ Zmiana silnika magicznej wyszukiwarki z Algolia na MeiliSearch Open Source</p>
            <p>✅ Dodanie atrybutu lazy do obrazków w magicznej wyszukiwarce</p>
        </div>
        <div class="py-2">
            <h2 class="text-white text-bold">v2.1 (15.08.2024)</h2>
            <p>✅ Dodano paginacje do wyników wyszukiwania</p>
            <p>✅ Małe optymalizacje ładowania podstron</p>
        </div>
        <div class="py-2">
            <h2 class="text-white text-bold">v2.0 (14.08.2024)</h2>
            <p>Strona została napisana zupełnie od nowa w Vue3(Nuxt3)</p>
            <p>Otworzyliśmy <a href="https://github.com/AXYZE9/archiwum.watch" class="text-purple-400 underline">kod
                    źródłowy (GitHub)</a></p>
            <p>✅ Magiczna wyszukiwarka</p>
            <p>✅ Wygenerowane napisy AI</p>
            <p>✅ Lajkowanie filmów</p>
            <p>✅ Replay czatu</p>
            <p>✅ Wznawianie filmu od ostatnio oglądanego momentu</p>
        </div>

        <div class="py-2">
            <h2 class="text-white text-bold">v1.0 (04.01.2024)</h2>
            <p>Nasze pierwsze wydanie!</p>
        </div>

        <div class="py-6">
            <h1 class="text-white text-bold text-2xl text-yellow-400">Planowane zmiany</h1>
            <p>⌛ Optymalizacja API (filtrowanie obiektów + paginacja po stronie serwera), znacznie przyspieszy to czas
                ładowania stron z listą filmów danego twórcy</p>
            <p>⌛ Pełnoekranowy odtwarzacz z czatem na telefonie</p>
        </div>
    </div>
</template>