export interface TagProps {
  value: string
}

export interface TagGroupProps {
  tags: string[]
}

export const Tag = ({ value }: TagProps) => (
  <div className="flex justify-center items-center px-2 py-1 rounded border border-[#385CAA] max-w-[88px] md:max-w-[112px] truncate">
    <span className="text-wrap text-xs md:text-sm font-light font-roboto w-full">
      {value}
    </span>
  </div>
)

export const TagGroup = ({ tags }: TagGroupProps) => (
  <div className="flex flex-row gap-2">
    {tags.map((value, i) => (
      <Tag key={i.toString()} value={value} />
    ))}
  </div>
)
