export interface IViennaOpenDataObject {
    'type': 'Feature',
    'id': string,
    'geometry': {
        'type': 'Point',
        'coordinates': [number, number]
    },
    'geometry_name': 'SHAPE',
    'properties': {
        'OBJECTID': number,
        'ID': number,
        'PLZ': number,
        'ORT': string,
        'STRASSE': string,
        'STANDORT': string,
        'TYP':
            'Brunnen' |
            'Denkmäler' |
            'Gedenktafeln' |
            'Grabmäler/Grabhaine' |
            'Kunst am Bau wandgebunden' |
            'Profanplastiken/Kunst am Bau freistehend' |
            'Sakrale Kleindenkmäler',
        'OBJEKTTITEL': string,
        'VULGONAMEN': string,
        'BIOGR_ANGABEN': string,
        'INSCHRIFT': string,
        'BESCHREIBUNG': string,
        'MATERIAL': string,
        'ENTSTEHUNG': string,
        'EPOCHE': string,
        'KUENSTLER': string,
        'GESCHICHTE': string,
        'LITERATURQUELLEN': string,
        'SE_ANNO_CAD_DATA': null
    }
}
