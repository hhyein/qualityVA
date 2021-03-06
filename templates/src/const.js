export const mainLayoutStyle = {
  gridGap: '10px',
  gridTemplateColumns: '220px 330px 400px 250px',
  gridTemplateRows: '35px 40px 260px 100px 100px 150px 150px',
  gridTemplateAreas: `
    'dataset combination action action-detail'
    'dataset combination action action-detail'
    'setting combination action action-detail'
    'setting my-combination action action-detail'
    'check overview overview overview'
    'check overview overview overview'
    'check overview overview overview'
  `,
}

export const boxTitles = {
  'dataset': 'dataset',
  'setting': 'setting',
  'action-detail': 'action-detail',
  'overview': 'overview',
  'check': 'check',
  'combination': 'combination',
  'action': 'action',
  'my-combination': 'my-combination',
}

export const PORT = 5000