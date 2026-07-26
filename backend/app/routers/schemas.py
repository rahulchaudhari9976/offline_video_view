from pydantic import BaseModel


class VideoResponse(BaseModel):

    id: int
    title: str
    description: str
    filename: str
    thumbnail: str
    duration: str
    size: str

    class Config:
        from_attributes = True