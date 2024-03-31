create table `family-tree`.people
(
    id       varchar(100) not null
    primary key,
    x1       int          null,
    y1       int          null,
    x2       int          null,
    y2       int          null,
    alive    int          null,
    de       date         null,
    di       date         null,
    fn       varchar(100) null,
    fullname varchar(100) null,
    sex      varchar(100) null,
    spouse   json         null,
    msn      varchar(100) null,
    mn       varchar(100) null,
    father   json         null,
    mother   json         null,
    occu     varchar(100) null,
    age      int          null,
    bfdate   date         null,
    pl_full  varchar(100) null,
    pl_short varchar(100) null,
    doc      json         null,
    comment  text         null,
    sn       varchar(100) null,
    dfdate   varchar(100) null,
    lifespan int          null,
    dreason  varchar(100) null,
    bplace   varchar(100) null,
    bfplace  varchar(100) null
    )
    engine = InnoDB;

