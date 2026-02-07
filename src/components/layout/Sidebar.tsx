import ApiSettings from '../sidebar/ApiSettings';
import StyleSelector from '../sidebar/StyleSelector';
import PanelSelector from '../sidebar/PanelSelector';
import ThemeSelector from '../sidebar/ThemeSelector';
import StorySelector from '../sidebar/StorySelector';
import GenerateButtons from '../sidebar/GenerateButtons';
import { useAppStore } from '../../store/useAppStore';

export default function Sidebar() {
  const generatedStories = useAppStore((s) => s.generatedStories);

  return (
    <aside className="w-[460px] min-w-[460px] bg-white border-r border-gray-200 overflow-y-auto h-[calc(100vh-56px)] max-md:w-full max-md:min-w-0 max-md:h-auto" style={{ scrollbarWidth: 'thin' }}>
      <div className="p-5 space-y-5">
        <div className="pb-5 border-b border-gray-100">
          <ApiSettings />
        </div>

        <div className="pb-5 border-b border-gray-100">
          <StyleSelector />
        </div>

        <div className="pb-5 border-b border-gray-100">
          <PanelSelector />
        </div>

        <div className="pb-5 border-b border-gray-100">
          <ThemeSelector />
        </div>

        <div className={generatedStories.length > 0 ? 'pb-5 border-b border-gray-100' : ''}>
          <GenerateButtons />
        </div>

        {generatedStories.length > 0 && (
          <div>
            <StorySelector />
          </div>
        )}
      </div>
    </aside>
  );
}
