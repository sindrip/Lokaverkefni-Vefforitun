filteredDB =
[
  // fyrir hvern leik, frá 0 uppí filteredDB.length
  0 = {
    date: dateObject,
    patch: String, ('6.20')
    players: = [
      // fyrir hvern player, frá 0 uppí players.length
      0 = {
        champion: String, ('Aatrox')
        skin: integer, (0)
        team: integer, (0)
        summonername: String, ('Ban Gragas')
        playertype: String, ('is HUMAN PLAYER')
      }
    ]
    bot_count: integer, (0)
    loading_time: float, (56.2131234)
    game_time: float, (1543.3115115)
    deaths = [
      // timestamp fyrir hvern death, frá 0 uppí n
      0: float (1251.3632115)
    ]
    game_result: String, ('W')
  }
]
Dæmi:
// Eftirfarandi velur fyrsta champion hjá fyrsta player í fyrsta lesna leik
filteredDB[0]['players'][0]['champion']

// ==============

champions = {
  // fyrir hvern champion
  'Aatrox' = {
    numgames: int,
    // fyrir hvern leik frá 0 og upp í numgames
    0 = {
      date: dateObject,
      patch: String, ('6.20')
      skin: integer, (0)
      team: integer, (0)
      deaths: integer, (5)
      gameTime: float, (1341.231551)
      gameResult: String, ('W')
    }
  }
}
Dæmi:
// Eftirfarandi velur skinnið sem var notað á Aatrox í fyrsta Aatrox leik sem var lesin
champions['Aatrox'][0]['skin']
