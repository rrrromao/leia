import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST() {
  const items = [
    { type: 'book', title: 'A câmara clara: nota sobre a fotografia', authors: 'BARTHES, Roland', year: 1984, publisher: 'Nova Fronteira', status: 'reading' },
    { type: 'book', title: 'A parte do fogo', authors: 'BLANCHOT, Maurice', year: 1997, publisher: 'Rocco', status: 'reading' },
    { type: 'book', title: 'As palavras e as coisas: uma arqueologia das ciências humanas', authors: 'FOUCAULT, Michel', year: 2000, publisher: 'Martins Fontes', edition: '8', status: 'reading' },
    { type: 'book', title: 'Atos humanos', authors: 'KANG, Han', year: 2021, publisher: 'Todavia', status: 'reading' },
    { type: 'book', title: 'O espaço biográfico: dilemas da subjetividade contemporânea', authors: 'ARFUCH, Leonor', year: 2010, publisher: 'EdUERJ', status: 'reading' },
    { type: 'book', title: 'A antropologia das emoções', authors: 'COELHO, Maria Claudia', year: 2021, publisher: 'FGV', status: 'reading' },
    { type: 'book', title: 'Tempo passado: cultura da memória e guinada subjetiva', authors: 'SARLO, Beatriz', year: 2007, publisher: 'UFMG; Companhia das Letras', status: 'reading' },
    { type: 'book', title: 'A ordem do discurso: aula inaugural no Collège de France, pronunciada em 2 de dezembro de 1970', authors: 'FOUCAULT, Michel', year: 2014, publisher: 'Edições Loyola', edition: '24', status: 'read' },
    { type: 'book', title: 'O espaço literário', authors: 'BLANCHOT, Maurice', year: 2011, publisher: 'Rocco', status: 'want_to_read' },
    { type: 'book', title: 'O livro por vir', authors: 'BLANCHOT, Maurice', year: 2005, publisher: 'Martins Fontes', status: 'want_to_read' },
    { type: 'book', title: 'A decantação da experiência: ensaios de filosofia contemporânea', authors: 'DUARTE, Pedro', year: 2022, publisher: 'Nau Editora', status: 'want_to_read' },
    { type: 'book', title: 'Método, métodos, contramétodo', authors: 'GARCIA, Regina Leite', year: 2003, publisher: 'Cortez', status: 'want_to_read' },
    { type: 'article', title: 'Currículo, narrativa e ficção de si: o currere como conversa complicada na formação de professores', authors: 'CRAVEIRO, Clarissa Bastos', year: 2020, journal: 'Série-Estudos', status: 'read' },
    { type: 'article', title: 'Sujeitos ao afeto: cinema, educação e alteridade', authors: 'GUERREIRO, Alexandre Silva', year: 2019, journal: 'Linha Mestra', status: 'read' },
    { type: 'article', title: 'A experiência como prova', authors: 'SCOTT, Joan Wallach', year: 1999, journal: 'Revista Estudos Feministas', status: 'read' },
    { type: 'book_chapter', title: 'Saberes localizados: a questão da ciência no feminismo e o privilégio da perspectiva parcial', authors: 'HARAWAY, Donna', year: 1995, bookTitle: 'Cadernos Pagu', pages: '7-41', status: 'read' },
    { type: 'book_chapter', title: 'O espaço biográfico: dilemas da subjetividade contemporânea', authors: 'ARFUCH, Leonor', year: 2010, bookTitle: 'Cadernos Pagu', status: 'reading' },
    { type: 'article', title: 'A antropologia das emoções', authors: 'COELHO, Maria Claudia', year: 2021, journal: 'Cadernos Pagu', status: 'reading' },
    { type: 'book_chapter', title: 'Saberes localizados: a questão da ciência no feminismo e o privilégio da perspectiva parcial', authors: 'HARAWAY, Donna', year: 1995, bookTitle: 'Cadernos Pagu', pages: '7-41', status: 'read' },
    { type: 'book_chapter', title: 'Tempo passado: cultura da memória e guinada subjetiva', authors: 'SARLO, Beatriz', year: 2007, bookTitle: 'Cadernos Pagu', status: 'reading' },
  ]

  for (const item of items) {
    await prisma.article.create({ data: item })
  }

  return NextResponse.json({ inserted: items.length })
}
