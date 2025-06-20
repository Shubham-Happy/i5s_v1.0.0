
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SearchResult {
  type: 'people' | 'jobs' | 'articles' | 'companies' | 'all';
  data: any[] | {
    people: any[];
    jobs: any[];
    articles: any[];
    companies: any[];
  };
}

export const useSearch = (searchTerm: string, type?: string) => {
  const fetchSearchResults = async (): Promise<SearchResult> => {
    console.log('=== SEARCH HOOK DEBUG START ===');
    console.log('Search term:', searchTerm);
    console.log('Search type:', type);
    
    if (!searchTerm || !searchTerm.trim()) {
      console.log('No search term provided, returning empty results');
      return { type: type as any || 'people', data: [] };
    }

    try {
      let peopleResults = [];
      let jobsResults = [];
      let articlesResults = [];
      let companiesResults = [];

      // Search people if needed
      if (!type || type === 'people') {
        console.log('Searching people...');
        const { data: peopleData, error: peopleError } = await supabase
          .from('profiles')
          .select('*')
          .or(`full_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)
          .limit(10);
        
        console.log('People query error:', peopleError);
        console.log('People raw data:', peopleData);
        console.log('People data length:', peopleData?.length);
        
        if (peopleData && !peopleError) {
          peopleResults = peopleData.map(person => ({
            id: person.id,
            name: person.full_name || person.username || 'Unknown User',
            username: person.username || '',
            avatar: person.avatar_url,
            headline: person.bio || person.status || 'cozync User',
            location: '',
            skills: [],
            followers: Math.floor(Math.random() * 1000), // Mock data
            following: Math.floor(Math.random() * 500) // Mock data
          }));
        }
        console.log('People results processed:', peopleResults);
        console.log('People results length:', peopleResults.length);
      }

      // Search jobs if needed
      if (!type || type === 'jobs') {
        console.log('Searching jobs...');
        const { data: jobsData, error: jobsError } = await supabase
          .from('job_listings')
          .select('*')
          .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%`)
          .limit(10);
        
        console.log('Jobs query error:', jobsError);
        console.log('Jobs raw data:', jobsData);
        console.log('Jobs data length:', jobsData?.length);
        
        if (jobsData && !jobsError) {
          jobsResults = jobsData.map(job => ({
            id: job.id,
            title: job.title,
            company: job.company,
            companyLogo: job.company_logo,
            location: job.location,
            salary: job.salary,
            type: job.type,
            posted: new Date(job.posted).toLocaleDateString(),
            tags: job.tags || [],
            description: job.description,
            applyLink: job.apply_link
          }));
        }
        console.log('Jobs results processed:', jobsResults);
        console.log('Jobs results length:', jobsResults.length);
      }

      // Search articles if needed
      if (!type || type === 'articles') {
        console.log('Searching articles...');
        const { data: articlesData, error: articlesError } = await supabase
          .from('articles')
          .select(`
            *,
            profiles (
              id,
              full_name,
              username,
              avatar_url
            )
          `)
          .or(`title.ilike.%${searchTerm}%,summary.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
          .limit(10);
        
        console.log('Articles query error:', articlesError);
        console.log('Articles raw data:', articlesData);
        console.log('Articles data length:', articlesData?.length);
        
        if (articlesData && !articlesError) {
          articlesResults = articlesData.map(article => ({
            id: article.id,
            title: article.title,
            summary: article.summary,
            coverImage: article.cover_image,
            author: {
              id: article.profiles?.id,
              name: article.profiles?.full_name || article.profiles?.username || 'Unknown Author',
              avatar: article.profiles?.avatar_url,
              role: 'cozync User'
            },
            publishedAt: article.published_at,
            readingTime: article.reading_time || '5 min',
            tags: article.tags || ['cozync'],
            likes: Math.floor(Math.random() * 100), // Mock data
            comments: Math.floor(Math.random() * 20) // Mock data
          }));
        }
        console.log('Articles results processed:', articlesResults);
        console.log('Articles results length:', articlesResults.length);
      }

      // Search companies if needed
      if (!type || type === 'companies') {
        console.log('Searching companies...');
        const { data: companiesData, error: companiesError } = await supabase
          .from('startups')
          .select('*')
          .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
          .limit(10);
        
        console.log('Companies query error:', companiesError);
        console.log('Companies raw data:', companiesData);
        console.log('Companies data length:', companiesData?.length);
        
        if (companiesData && !companiesError) {
          companiesResults = companiesData.map(company => ({
            id: company.id,
            name: company.name,
            logo: company.logo,
            industry: company.category,
            location: company.location,
            size: '1-10 employees',
            description: company.description,
            founded: company.created_at ? new Date(company.created_at).getFullYear().toString() : 'Unknown'
          }));
        }
        console.log('Companies results processed:', companiesResults);
        console.log('Companies results length:', companiesResults.length);
      }

      // Format results based on type
      let finalResult: SearchResult;
      
      if (type === 'people') {
        finalResult = { type: 'people', data: peopleResults };
      } else if (type === 'jobs') {
        finalResult = { type: 'jobs', data: jobsResults };
      } else if (type === 'articles') {
        finalResult = { type: 'articles', data: articlesResults };
      } else if (type === 'companies') {
        finalResult = { type: 'companies', data: companiesResults };
      } else {
        finalResult = {
          type: 'all',
          data: {
            people: peopleResults,
            jobs: jobsResults,
            articles: articlesResults,
            companies: companiesResults
          }
        };
      }
      
      console.log('Final search result:', finalResult);
      console.log('Final result type:', finalResult.type);
      console.log('Final result data type:', typeof finalResult.data);
      console.log('=== SEARCH HOOK DEBUG END ===');
      
      return finalResult;
    } catch (error) {
      console.error('Search error:', error);
      return { type: type as any || 'people', data: [] };
    }
  };

  return useQuery({
    queryKey: ['search', searchTerm, type],
    queryFn: fetchSearchResults,
    enabled: !!searchTerm && searchTerm.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
