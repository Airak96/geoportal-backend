const data = ref([
  {
    name: 'Ecosistemas Peru-Ecuador',
    ref: 'ecosistemas',
    url: '/capas/ecosistemas_pe_ec.geojson',
    style: {
      stroke: {
        color: 'brown',
      }
    },
    show: false,
    type: 'vector'
  },
  {
    name: 'Parroquias Ecuador',
    ref: 'parroquias',
    url: '/capas/limite_parr_ec.geojson',
    style: {
      stroke: {
        color: 'red',
        width: 2,
      },
      fill: {
        color: 'rgba(38, 245, 15,0.4)'
      }
    },
    show: false,
    type: 'vector'
  },
  {
    name: 'Poblados Ecuador',
    ref: 'poblados',
    url: '/capas/poblados_ec_2014.geojson',
    style: {
      circle: {
        radius: 7,
        fill: {
          color: 'red',
        },
      }
    },
    show: false,
    type: 'vector'
  },
  {
    name: 'Distritos Peru',
    ref: 'distritos',
    url: '/capas/limite_dist_pe.geojson',
    style: {
      stroke: {
        color: 'orange',
        width: 2,
      },
      fill: {
        color: 'rgba(15, 96, 245,0.4)'
      }
    },
    show: false,
    type: 'vector'
  },
  {
    name: 'Poblados Peru',
    ref: 'poblados2',
    url: '/capas/poblados_pe.geojson',
    style: {
      circle: {
        radius: 7,
        fill: {
          color: 'yellow',
        }
      }
    },
    show: false,
    type: 'vector'
  },
  {
    name: 'Cobertura Ecuador',
    ref: 'cobertura',
    url: '/capas/cober_ecu.geojson',
    style: {
      stroke: {
        color: '#26f50f',
        width: 2,
      }
    },
    show: false,
    type: 'vector'
  },
  {
    name: 'Cobertura Ecuador',
    ref: 'cobertura',
    url: '/capas/cober_ecu.geojson',
    style: {
      stroke: {
        color: '#26f50f',
        width: 2,
      }
    },
    show: false,
    type: 'vector'
  },
]);