import type { NextPage } from 'next';

const SubFooter: NextPage = () => {
  return (
      <div className='container mx-0 mw-100 pb-3'>
        <div className='row'>
          <div className='d-sm-none col-12'>
              <button style={{ opacity: '1', fontWeight: 'bold' }} className=' btn btn-success rounded-5 form-control' disabled>Nombre de points: 20/60</button>
          </div>
        </div>
    </div>
  )
}

export default SubFooter
