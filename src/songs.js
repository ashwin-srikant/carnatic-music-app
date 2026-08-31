export const talams = {
  'Adi': { beats: 8, description: '8 aksharas' },
  'Rupakam': { beats: 6, description: '6 aksharas' },
  'Misra Chapu': { beats: 7, description: '7 aksharas' },
  'Khanda Chapu': { beats: 5, description: '5 aksharas' },
  'Chatusra Ekam': { beats: 4, description: '4 aksharas' },
}

export const songs = [
  ['Vatapi Ganapathim', 'Adi'], ['Jaya Jaya Ganapathi', 'Adi'],
  ['Apparamabhakthi', 'Rupakam'], ['Manasuloni', 'Adi'],
  ['Mamava Sada Varade', 'Rupakam'], ['Nadasudha', 'Rupakam'],
  ['Sabhapatiku', 'Rupakam'], ['Seetamma Mayamma', 'Rupakam'],
  ['Gopika Manoharam', 'Adi'], ['Manavyalakinca', 'Adi'],
  ['Pankaja Lochana', 'Misra Chapu'], ['Sujana Jeevana', 'Rupakam'],
  ['Tulasi Dalamulace', 'Rupakam'], ['Himadri Sute', 'Rupakam'],
  ['Himagiri Tanaye', 'Adi'], ['Kapali', 'Adi', '2 kalai'],
  ['Akshaya Linga', 'Misra Chapu'], ['Maa Ramanan', 'Rupakam'],
  ['Devi Neeye Thunai', 'Adi'], ['Rama Nee Samana Mevaru', 'Rupakam'],
  ['Shankari Shankuru', 'Adi', 'Tisra gati'], ['Sharade Karunanidhe', 'Misra Chapu'],
  ['Bantu Riti Koluvu', 'Adi'], ['Deva Deva Kalayami', 'Rupakam'],
  ['Maha Ganapathim', 'Chatusra Ekam'], ['Samaja Vara Gamana', 'Adi'],
  ['Sri Saraswati Namostute', 'Rupakam'], ['Kanjadalayatakshi', 'Adi'],
  ['Sri Varalakshmi', 'Rupakam'],
].map(([title, talam, note]) => ({ title, talam, note }))
