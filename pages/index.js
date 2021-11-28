import {
  Tooltip,
  TooltipHandler,
  TooltipVisible,
  TooltipHidden,
} from '../src/components/Tooltip'

export default function Home() {
  return (
    <div className="app flex flex-col items-center">
      <h1 className="text-4xl mb-10">Hello world</h1>
      {/* <hr /> */}
      <Tooltip>
        <div className="w-64 bg-blue-100 p-4">
          <TooltipHandler
            onOpen={() => console.log('openin')}
            onClose={() => console.log('hidin')}
          >
            <TooltipVisible>
              <div className="text-lg text-blue-800 cursor-pointer">
                I am a showable text
              </div>
            </TooltipVisible>
            <TooltipHidden>
              <div className="text-lg text-yellow-600 cursor-pointer p-4 rounded-lg bg-yellow-100 mt-4">
                I am a hidden text
              </div>
            </TooltipHidden>
          </TooltipHandler>
        </div>
      </Tooltip>
    </div>
  )
}
