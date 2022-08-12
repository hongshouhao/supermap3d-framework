import proj4 from 'proj4';
proj4.defs('EPSG:3857','+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs +type=crs');
proj4.defs('EPSG:4490','+proj=longlat +ellps=GRS80 +no_defs +type=crs');
proj4.defs('EPSG:4528','+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=40500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs');
proj4.defs('EPSG:4549','+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs');