export interface AllMovieGetResponse {
    data: MixMovieGetResponse[];
}

export interface MixMovieGetResponse {
    movie: MovieGetResponse[];
    creator: PersonGetResponse[];
    star: PersonGetResponse[];
}

export interface MovieGetResponse {
    mid:    number;
    name:   string;
    pic:    string;
    video:  string;
    rate:   number;
    year:   number;
    length: string;
    genre:  string;
    des:    string;
}

export interface PersonGetResponse {
    pid:  number;
    name: string;
    pic:  string;
    des:  string;
    age:  number;
}

